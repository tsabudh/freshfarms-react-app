import { Pagination } from "@mui/material";
import classNames from "classnames/bind";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { PiFilePdfDuotone } from "react-icons/pi";
import type { FilterObject } from "types/filter.types";
import type { Transaction as TransactionType } from "types/transaction.type";
import styles from "./TransactionTable.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { fetchTransactions } from "../../utils/fetchTransactions";
import { convertToPDF } from "../../utils/pdf";
import Transaction from "../Transaction/Transaction";

import Button from "../UI/Button/Button";
const cx = classNames.bind(styles);

const TransactionTable = ({
  transactionFilterObject,
  showPagination = true,
}: {
  transactionFilterObject: FilterObject;
  showPagination?: boolean;
}) => {
  const { jwtToken, user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  const retrieveTransactions = useCallback(async () => {
    if (!jwtToken) {
      console.error("JWT token is not available.");
      return;
    }

    try {
      if (!transactionFilterObject) {
        throw new Error("Transaction filter object not defined.");
      }

      const result = await fetchTransactions(
        jwtToken,
        transactionFilterObject,
        currentPage,
        displayCount
      );

      setTransactions(result.data);
      setTotalPages(result.totalPages);
      setTotalDocs(result.totalDocs);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error while fetching transactions", error);
      }
    }
  }, [jwtToken, transactionFilterObject, currentPage, displayCount]);

  useEffect(() => {
    retrieveTransactions();
  }, [retrieveTransactions]);

  if (!user) return null;

  return (
    <div className={cx("container")}>
      <div className={cx("download")}>
        <div
          className={cx("icon")}
          onClick={() => convertToPDF(transactions)}
          title="Download transactions as PDF"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              convertToPDF(transactions);
            }
          }}
        >
          <Button className="berry-02 small">
            <PiFilePdfDuotone />
          </Button>
        </div>
      </div>

      {transactions?.map((transaction: TransactionType, index) => {
        const customer = transaction.customer;

        return (
          <Transaction
            key={transaction._id}
            transaction={transaction}
            id={transaction._id}
            serialNumber={index}
            items={transaction.items}
            timeStamp={transaction.issuedTime}
            customer={{
              name: customer?.name ?? "Unknown",
              _id: customer?._id ?? "unknown-id",
            }}
            purchaseAmount={transaction.purchaseAmount}
            paidAmount={transaction.paid}
            type={transaction.type}
            paidInFull={transaction.paidInFull}
          />
        );
      })}
      <section className={cx("pagination")}>
        {showPagination ? (
          <Pagination
            count={totalPages}
            onChange={(_, page) => setCurrentPage(page)}
          />
        ) : null}
      </section>
    </div>
  );
};

export default TransactionTable;
