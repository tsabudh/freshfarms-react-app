import React, { useState } from 'react';

import Details from './Details/Details';

import styles from './Transaction.module.scss';
import Modal from '../UI/Modal/Modal';

const Transaction = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const TransactionClickHandler = () => {
        setIsExpanded(!isExpanded);
    };
    // let customer = props.customer[0];
    let customer = props.customer;
    let transactionTime = new Date(props.timeStamp).toLocaleTimeString(
        undefined,
        {
            hour: 'numeric',
            minute: 'numeric',
        }
    );
    let transactionDate = new Date(props.timeStamp).toLocaleDateString(
        undefined,
        {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }
    );

    return (
        <div
            className={`${styles.Transaction} ${
                props.type == 'payment' ? styles['payment'] : ''
            }`}
            onClick={TransactionClickHandler}
        >
            <div className={styles['date-and-time']}>
                <div className={styles.time}>
                    {transactionTime.split(' ')[0]}{' '}
                    <span className={styles.period}>
                        {transactionTime.slice(-2)}
                    </span>
                </div>

                <div className={styles.date}>{transactionDate}</div>
            </div>
            <div className={styles['transaction-details']}>
                <div className={styles.customer}>{customer.name}</div>

                <ul className={styles['product-list']}>
                    {props.items.map((item) => {
                        return (
                            <li key={item._id}>
                                <a className={styles.product}>
                                    {item.productName}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {!props.paidInFull && props.paidAmount != 0 && (
                <div className={`${styles['cost']} ${styles['paid']}`} title='Paid amount'>
                    Rs. {props.paidAmount}
                    {!isExpanded && props.type == 'purchase' && ' |'}
                </div>
            )}
            {props.type == 'purchase' ? (
                <div
                    className={`${styles.cost} ${
                        props.paidInFull ? styles['paid'] : styles['unpaid']
                    }`}
                    title='Total Amount'
                >
                    Rs. {props.purchaseAmount}
                </div>
            ) : null}

            <Modal isOpen={isExpanded} onClose={() => setIsExpanded(false)}>
                <Details
                    // items={props.items}
                    // purchaseAmount={props.purchaseAmount}
                    {...props}
                />
            </Modal>
        </div>
    );
};

export default Transaction;
