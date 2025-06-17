import React, { useEffect, useState } from "react";

import Details from "./Details/Details";

import styles from "./Transaction.module.scss";
import Modal from "../UI/Modal/Modal";

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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const TransactionClickHandler = () => {
    setIsExpanded(!isExpanded);
  };
  // let customer = =customer[0];
  let transactionTime = new Date(timeStamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
  let transactionDate = new Date(timeStamp).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  

  return (
    <div
      className={`${styles.Transaction} ${
        type == "payment" ? styles["payment"] : ""
      }`}
      onClick={TransactionClickHandler}
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
                <a className={styles.product}>{item.productName}</a>
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

      <Modal isOpen={isExpanded} onClose={() => setIsExpanded(false)}>
        {isExpanded && (
          <Details
            // items={=items}
            // purchaseAmount={=purchaseAmount}
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
        )}
      </Modal>
    </div>
  );
};

export default React.memo(Transaction);
