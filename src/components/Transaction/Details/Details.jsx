import React, { useState } from 'react';
import styles from './Details.module.scss';

const Details = (props) => {
    const { items, purchaseAmount } = props;
    console.log(props);
    return (
        <React.Fragment>
            <div className={styles['container']}>
                <section className={styles['section']}>
                    <h4>Customer</h4>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Name</div>
                        <div className={styles['values']}>
                            {props.customer.name}
                        </div>
                    </div>
                    <div className={styles['field']}>
                        <div className={styles['title']}>ID</div>
                        <div className={styles['values']}>
                            {props.customer._id}
                        </div>
                    </div>
                </section>

                <section className={styles['section']}>
                    <h4>Transaction</h4>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Transaction ID</div>
                        <div className={styles['values']}>{props.id}</div>
                    </div>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Type</div>
                        <div className={styles['values']}>
                            {props.transaction.type}
                        </div>
                    </div>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Cost</div>
                        <div className={styles['values']}>
                            {props.transaction.purchaseAmount}
                        </div>
                    </div>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Paid In Full</div>
                        <div className={styles['values']}>
                            {props.transaction.paidInFull.toString()}
                        </div>
                    </div>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Paid</div>
                        <div className={styles['values']}>
                            {props.transaction.paid}
                        </div>
                    </div>
                    <div className={styles['field']}>
                        <div className={styles['title']}>Items</div>
                        <div className={styles['values']}>
                            <div className={styles["spacer"]}></div>
                            {props.transaction.items.map((item, index) => {
                                return (
                                    <div className={styles['item']}>
                                        <div
                                            className={styles['item-property']}
                                        >
                                            <div className={styles['item-key']}>
                                                Product Name
                                            </div>
                                            <div
                                                className={styles['item-value']}
                                            >
                                                {item.productName}
                                            </div>
                                        </div>
                                        <div
                                            className={styles['item-property']}
                                        >
                                            <div className={styles['item-key']}>
                                                Product Quantity
                                            </div>
                                            <div
                                                className={styles['item-value']}
                                            >
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div
                                            className={styles['item-property']}
                                        >
                                            <div className={styles['item-key']}>
                                                Price then
                                            </div>
                                            <div
                                                className={styles['item-value']}
                                            >
                                                {item.priceThen}
                                            </div>
                                        </div>
                                        <div
                                            className={styles['item-property']}
                                        >
                                            <div className={styles['item-key']}>
                                                Product ID
                                            </div>
                                            <div
                                                className={styles['item-value']}
                                            >
                                                {item.productId}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className={styles['summary']}>
                    <h4>Summary</h4>
                    <table className={styles['summary-table']}>
                        <thead>
                            <tr>
                                <th>S.N</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                return (
                                    <SalesRow
                                        item-key={item._id}
                                        serialNumber={index + 1}
                                        product={item.productName}
                                        priceThen={item.priceThen}
                                        quantity={item.quantity}
                                        totalPrice={
                                            item.priceThen * item.quantity
                                        }
                                    />
                                );
                            })}

                            <tr>
                                <td></td>
                                <td></td>
                                <td>Total</td>
                                <td>{items.length}</td>
                                <td>{purchaseAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </React.Fragment>
    );
};

export default Details;
const SalesRow = (props) => {
    return (
        <tr>
            <td>{props.serialNumber}</td>
            <td className={styles.product}>{props.product}</td>
            <td>{props.priceThen}</td>
            <td>{props.quantity}</td>
            <td>{props.totalPrice}</td>
        </tr>
    );
};
