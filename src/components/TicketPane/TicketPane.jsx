import { useState, useEffect } from 'react';
import Ticket from '../ticket/Ticket';

const fetchTransactions = () => {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                let transactions = JSON.parse(xhttp.responseText);
                return resolve(transactions);
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
    const [transactions, setTransactions] = useState({});
    console.log('Ticket Pane');
    // console.log(transactions);

    useEffect(() => {
        let x = async () => {
            let transactionsReceived = await fetchTransactions();
            console.log('tkskfdjk');
            console.log(transactionsReceived);
            return transactionsReceived;
        };
        setTransactions(x);
    }, []);
    return (
        <div>
            <Ticket />
        </div>
    );
};

export default TicketPane;
