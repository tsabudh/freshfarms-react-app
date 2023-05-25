import React from 'react';
import { useState } from 'react';
import styles from './SalesTable.module.scss';

const SalesRow = (props) => {
    return (
        <tr>
            <td>{props.serialNumber}</td>
            <td>{props.product}</td>
            <td>{props.price}</td>
            <td>{props.quantity}</td>
            <td>{props.cost}</td>
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
                            <li key={item.id}>
                                <a className={styles.product}>
                                    {item.productName}
                                </a>
                            </li>
                        );
                    })}{' '}
                </ul>
            )}

            {isExpanded && (
                <table className={styles['sales-table']}>
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            return (
                                <SalesRow
                                    key={item._id}
                                    serialNumber={index + 1}
                                    product={item.productName}
                                    price={item.price}
                                    quantity={item.quantity}
                                    cost={item.priceThen}
                                />
                            );
                        })}

                        <tr>
                            <td></td>
                            <td></td>
                            <td>Total</td>
                            <td>{items.length}</td>
                            <td>{props.cost}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </React.Fragment>
    );
};

export default SalesTable;
