import React, { useState, useEffect, useContext } from 'react';
import Transaction from '../Transaction/Transaction';

import { AuthContext } from '../../context/AuthContext';

import { fetchTransactions } from '../../utils/fetchTransactions';

const TransactionTable = (props) => {
    const { filterObject } = props;

    const { jwtToken } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);

    const asyncWrapper = async () => {
        try {
            console.log('Fetching Transactions...');
            let result = await fetchTransactions(filterObject, jwtToken);
            setTransactions(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        asyncWrapper();
    }, [filterObject]);

    return (
        <div>
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
