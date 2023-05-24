import { useState, useEffect } from 'react';
import Ticket from '../Ticket/Ticket';

const transactionPromiseFunc = () => {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                let responseReceived = JSON.parse(xhttp.responseText);
                resolve(responseReceived.data);
            }
        };
        xhttp.open('GET', 'http://127.0.0.1:3000/transactions/');

        //* Hard coded authorization for Sachin Paudel(admin)
        xhttp.setRequestHeader(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
        );
        xhttp.send();
    });
};

const TicketPane = () => {
    const [transactions, setTransactions] = useState([]);
    console.log('Ticket Pane');

    useEffect(() => {
        let asyncWrapper = async () => {
            try {
                let result = await transactionPromiseFunc();
                setTransactions(result);
            } catch (error) {
                console.log(error);
            }
        };
        asyncWrapper();
    }, []);

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
                        cost={transaction.cost}
                    />
                );
            })}
        </div>
    );
};

export default TicketPane;
