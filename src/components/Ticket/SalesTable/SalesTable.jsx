import React from 'react';
import { useState } from 'react';
import styles from './SalesTable.module.scss';

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

const SalesTable = (props) => {
    let isExpanded = props.isExpanded;

    const items = props.items;
    return (
        <React.Fragment>
            {!isExpanded && (
                <ul className={styles['product-list']}>
                    {items.map((item) => {
                        return (
                            <li key={item._id}>
                                <a className={styles.product}>
                                    {item.productName}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}

            {isExpanded && (
                <table className={styles['sales-table']}>
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th >Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            return (
                                <SalesRow
                                    key={item._id}
                                    serialNumber={index + 1}
                                    product={item.productName}
                                    priceThen={item.priceThen}
                                    quantity={item.quantity}
                                    totalPrice={item.priceThen * item.quantity}
                                />
                            );
                        })}

                        <tr>
                            <td></td>
                            <td></td>
                            <td>Total</td>
                            <td>{items.length}</td>
                            <td>{props.transactionAmount}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </React.Fragment>
    );
};

export default SalesTable;
