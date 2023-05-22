import React from 'react';

import styles from './Ticket.module.scss';

const SalesRow = () => {
    return (
        <tr>
            <td>Product</td>
            <td>Price</td>
            <td>Quantity</td>
            <td>Cost</td>
        </tr>
    );
};

const Ticket = (props) => {
    return (
        <div className={styles.ticket}>
            <div className={styles['date-and-time']}>
                <div className={styles.time}>9:00</div>
                <div className={styles.date}>2023/05/22</div>
            </div>
            <div className="transaction-details">
                <div className={styles.customer}>Balaram Subedi</div>
                <div className={styles['sales-table']}>
                    <div className={styles.product}>Yogurt</div>
                </div>
                <div className={styles['quantity-and-sale']}>
                    <div className={styles.quantity}>2</div>
                    <div className={styles.sale}>Rs. 240</div>
                </div>
            </div>

            <div className="edit">Edit</div>
        </div>
    );
};

export default Ticket;
