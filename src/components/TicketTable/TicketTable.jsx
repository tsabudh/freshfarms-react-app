import React, { useState, useEffect } from 'react';
import Ticket from '../Ticket/Ticket';

import { fetchTransactions } from '../../utils/fetchTransactions';


const TicketTable = (props) => {
    const { filterObject } = props;

    const [transactions, setTransactions] = useState([]);

    let asyncWrapper = async () => {
        try {
            console.log('Fetching Transactions...');
            let result = await fetchTransactions(filterObject);
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
                        transactionAmount={transaction.transactionAmount}
                        // transactionItemsQuantity={transaction.transactionItemsQuantity}
                    />
                );
            })}
        </div>
    );
};

export default TicketTable;
