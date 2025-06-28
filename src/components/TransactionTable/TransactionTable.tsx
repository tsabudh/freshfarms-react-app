import classNames from "classnames/bind";
import React, { useState, useEffect, useContext } from "react";
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
}: {
  transactionFilterObject: FilterObject;
}) => {
  const { jwtToken, user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const asyncWrapper = async () => {
    if(!jwtToken) {
      console.error("JWT token is not available.");
      return;
    }
    try {
      if (!transactionFilterObject) {
        throw new Error("Transaction filter object not defined.");
      }
      const result = await fetchTransactions(transactionFilterObject, jwtToken);
      setTransactions(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error while fetching transactions", error);
      }
    }
  };

  asyncWrapper();
}, [transactionFilterObject, jwtToken]);

  if (!user) return null;

  return (
    <div className={cx("container")}>
      <div className={cx("download")}>
        <div
          className={cx("icon")}
          onClick={() => convertToPDF(transactions)}
          title="Download transactions as PDF"
          role="button"
          tabIndex={0 }
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
    </div>
  );
};

export default TransactionTable;
