import React, { useState, useEffect, useContext } from 'react';
import Ticket from '../Ticket/Ticket';

import { fetchTransactions } from '../../utils/fetchTransactions';
import { AuthContext } from '../../context/AuthContext';

const TicketTable = (props) => {
    const { filterObject } = props;

    const { token } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);

    let asyncWrapper = async () => {
        try {
            console.log('Fetching Transactions...');
            let result = await fetchTransactions(filterObject, token);
            setTransactions(result);
            // liftTransactions(result);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        asyncWrapper();
    }, [filterObject]);

    return (
        <div>
            {transactions.map((transaction, index, transactionArray) => {
                let customer = [transaction.customer];
                return (
                    <Ticket
                        key={transaction._id}
                        serialNumber={index}
                        items={transaction.items}
                        timeStamp={transaction.issuedTime}
                        customer={customer}
                        purchaseAmount={transaction.purchaseAmount}
                        paidAmount={transaction.paid}
                        type={transaction.type}
                        paidInFull={transaction.paidInFull}
                        // transactionItemsQuantity={transaction.transactionItemsQuantity}
                    />
                );
            })}
        </div>
    );
};

export default TicketTable;
