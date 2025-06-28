import React, { useState, lazy, Suspense } from "react";

import type { Transaction, TransactionItem } from "types/transaction.type";

import styles from "./Transaction.module.scss";

const LazyDetails = lazy(() => import("./Details/Details"));
const LazyModal = lazy(() => import("../UI/Modal/Modal"));

const Transaction = ({
  customer,
  timeStamp,
  items,
  paidInFull,
  purchaseAmount,
  paidAmount,
  type,
  serialNumber,
  transaction,
  id,
}: {
  customer: { name: string; _id: string };
  timeStamp: string;
  items: TransactionItem[];
  paidInFull: boolean | "no" | "yes";
  purchaseAmount: number;
  paidAmount: number;
  type: string;
  serialNumber: number;
  transaction: Transaction;
  id: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const TransactionClickHandler = () => {
    setIsExpanded(!isExpanded);
  };
  // let customer = =customer[0];
  const transactionTime = new Date(timeStamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
  const transactionDate = new Date(timeStamp).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      role="button"
      className={`${styles.Transaction} ${
        type == "payment" ? styles["payment"] : ""
      }`}
      onClick={TransactionClickHandler}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          TransactionClickHandler();
        }
        if (e.key === "Escape") {
          setIsExpanded(false);
        }
      }}
    >
      <div className={styles["date-and-time"]}>
        <div className={styles.time}>
          {transactionTime.split(" ")[0]}{" "}
          <span className={styles.period}>{transactionTime.slice(-2)}</span>
        </div>

        <div className={styles.date}>{transactionDate}</div>
      </div>
      <div className={styles["transaction-details"]}>
        <div className={styles.customer}>{customer.name}</div>

        <ul className={styles["product-list"]}>
          {items.map((item) => {
            return (
              <li key={item._id}>
                <button className={styles.product}>{item.productName}</button>
              </li>
            );
          })}
        </ul>
      </div>
      {!paidInFull && paidAmount != 0 && (
        <div
          className={`${styles["cost"]} ${styles["paid"]}`}
          title="Paid amount"
        >
          {paidAmount}
          {!isExpanded && type == "purchase"}
        </div>
      )}
      {type == "purchase" ? (
        <div
          className={`${styles.cost} ${
            paidInFull ? styles["paid"] : styles["unpaid"]
          }`}
          title="Total Amount"
        >
          {purchaseAmount}
        </div>
      ) : (
        <div
          className={`${styles.cost} ${
            paidInFull ? styles["paid"] : styles["unpaid"]
          }`}
          title="Total Amount"
        >
          {paidAmount}
        </div>
      )}

      {isExpanded && (
        <Suspense fallback={<div>Loading transaction details...</div>}>
          <LazyModal isOpen={isExpanded} onClose={() => setIsExpanded(false)}>
            <LazyDetails
              items={items}
              purchaseAmount={purchaseAmount}
              paidAmount={paidAmount}
              paidInFull={paidInFull}
              serialNumber={serialNumber}
              timeStamp={timeStamp}
              transaction={transaction}
              type={type}
              customer={customer}
              id={id}
            />
          </LazyModal>
        </Suspense>
      )}
    </div>
  );
};

export default React.memo(Transaction);
