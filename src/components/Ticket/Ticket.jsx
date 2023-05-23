import React from 'react';

import styles from './Ticket.module.scss';

let x = {
    _id: '646b93c75676bc760790ec66',
    issuedTime: '2023-05-22T16:09:40.143Z',
    items: [
        {
            productName: 'cow milk',
            quantity: 1,
            _id: '646b93c75676bc760790ec67',
            productId: '646a0631cbfb7c60713ecfb1',
            priceThen: 120,
        },
        {
            productId: '646a0805ed93ab01d3e43c28',
            quantity: 1,
            _id: '646b93c75676bc760790ec68',
            productName: 'kurauni',
            priceThen: 111,
        },
    ],
    __v: 0,
};

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

const SalesTable = () => {
    return (
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
                {x.items.map((item, index) => {
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
                    <td>4</td>
                    <td>Rs 440</td>
                </tr>
            </tbody>
        </table>
    );
};

const Ticket = (props) => {
    return (
        <div className={styles.ticket}>
            <div className={styles['date-and-time']}>
                <div className={styles.time}>9:00</div>
                <div className={styles.date}>2023/05/22</div>
            </div>
            <div className={styles['transaction-details']}>
                <div className={styles.customer}>Balaram Subedi</div>
                <SalesTable />
            </div>

            <div className="edit">Edit</div>
        </div>
    );
};

export default Ticket;
