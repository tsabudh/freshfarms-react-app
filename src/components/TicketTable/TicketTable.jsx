import React, { useState, useEffect } from 'react';
import Ticket from '../Ticket/Ticket';

export const transactionPromiseFunc = (filterObject) => {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                let responseReceived = JSON.parse(xhttp.responseText);
                resolve(responseReceived.data);
            }
        };

        const filterString = JSON.stringify(filterObject);

        const filterParam = btoa(filterString);
        xhttp.open(
            'GET',
            `http://127.0.0.1:3000/api/v1/transactions/?filter=${filterParam}`
        );

        //* Hard coded authorization for Sachin Paudel(admin)
        xhttp.setRequestHeader(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
        );
        xhttp.send();
    });
};


const TicketTable = (props) => {
    const { filterObject } = props;

    const [transactions, setTransactions] = useState([]);

    let asyncWrapper = async () => {
        try {
            console.log('Fetching Transactions...');
            let result = await transactionPromiseFunc(filterObject);
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
