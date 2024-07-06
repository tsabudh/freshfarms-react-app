import React, { useState, useEffect, useContext } from 'react';
import Transaction from '../Transaction/Transaction';
import classNames from 'classnames/bind';

import { PiFilePdfDuotone } from 'react-icons/pi';

import { AuthContext } from '../../context/AuthContext';
import styles from './TransactionTable.module.scss';

import Button from '../UI/Button/Button';
import { fetchTransactions } from '../../utils/fetchTransactions';
import { convertToPDF } from '../../utils/pdf';

const cx = classNames.bind(styles);

const TransactionTable = (props) => {
    const { transactionFilterObject } = props;

    const { jwtToken } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);

    const asyncWrapper = async () => {
        try {
            if (!transactionFilterObject) {
                throw new Error('Transaction filter object not defined.');
            }
            let result = await fetchTransactions(
                transactionFilterObject,
                jwtToken
            );
            setTransactions(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        asyncWrapper();
    }, [transactionFilterObject]);

    return (
        <div className={cx('container')}>
            <div className={cx('download')}>
                <div
                    className={cx('icon')}
                    onClick={() => convertToPDF(transactions)}
                    title="Download transactions as PDF"
                >
                    <Button className="icon03">
                        <PiFilePdfDuotone />
                    </Button>
                </div>
            </div>

            {transactions?.map((transaction, index) => {
                let customer = transaction.customer;

                return (
                    <Transaction
                        key={transaction._id}
                        transaction={transaction}
                        id={transaction._id}
                        serialNumber={index}
                        items={transaction.items}
                        timeStamp={transaction.issuedTime}
                        customer={customer}
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
