import React,{ useEffect, useState } from 'react';

const StatementTable = (props) => {
    let {
        numberOfCustomers,
        totalAmount,
        numberOfTransactions,
        monthlyTransactions,
    } = props;

    const [cumulative, setCumulative] = useState([{}]);

    useEffect(() => {
        if (monthlyTransactions) {
            let tempCumulative = [{}];
            monthlyTransactions.map((transaction, transactionIndex) => {
                tempCumulative[transactionIndex] = {};

                if (transactionIndex != 0) {
                    tempCumulative[transactionIndex].amount =
                        tempCumulative[transactionIndex - 1].amount +
                        transaction.transactionAmount;

                    tempCumulative[transactionIndex].paid =
                        tempCumulative[transactionIndex - 1].paid +
                        (transaction?.paid ?? 0);

                    tempCumulative[transactionIndex].balance =
                        tempCumulative[transactionIndex].amount -
                        tempCumulative[transactionIndex].paid;
                } else {
                    tempCumulative[0].amount = transaction.transactionAmount;

                    tempCumulative[0].paid = transaction?.paid ?? 0;

                    tempCumulative[0].balance =
                        tempCumulative[0].amount - tempCumulative[0].paid;
                }
            });
            console.log(monthlyTransactions);
            console.log(tempCumulative);
            setCumulative(tempCumulative);
        }
    }, [monthlyTransactions]);

    let totalPaid = 0;
    let totalBalance = totalAmount - totalPaid;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Transactions</th>
                        <th>Customers </th>
                        <th>Paid</th>
                        <th>Amount</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{numberOfTransactions}</th>
                        <th>
                            {numberOfCustomers.registered}/
                            {numberOfCustomers.unregistered}
                        </th>
                        <th>{totalPaid}</th>
                        <th>{totalAmount}</th>
                        <th>{totalBalance}</th>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Balance</th>
                        <th>C. Amount</th>
                        <th>C. Paid</th>
                        <th>C. Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {monthlyTransactions &&
                        monthlyTransactions.map((transaction, index) => {
                            return (
                                <tr key={transaction._id}>
                                    <td>
                                        {new Date(
                                            transaction.issuedTime
                                        ).toDateString()}
                                    </td>
                                    <td>{transaction.customer.name}</td>
                                    <td>{transaction.transactionAmount}</td>
                                    <td>{transaction?.paid ?? 0}</td>
                                    <td>
                                        {transaction.transactionAmount -
                                            (transaction?.paid ?? 0)}
                                    </td>
                                    <td>{cumulative[index]?.amount}</td>
                                    <td>{cumulative[index]?.paid}</td>
                                    <td>{cumulative[index]?.balance}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default StatementTable;
