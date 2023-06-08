import React, { useEffect, useRef, useState } from 'react';
import Calender from '../Calender/Calender';

import styles from './CustomerPane.module.scss';
import TicketTable from '../TicketTable/TicketTable';
import CustomerProfile from './CustomerProfile';
let global;

const fetchCustomers = (id) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response.data);
                }
            };
            let apiRoute =
                id == true
                    ? `http://127.0.0.1:3000/customers/${id.toString()}`
                    : 'http://127.0.0.1:3000/customers/';

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
            );
            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};

const CustomerPane = () => {
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [filterObject, setFilterObject] = useState({});
    const [transactions, setTransactions] = useState([]);

    let customers = useRef([]);

    let asyncWrapper = async () => {
        try {
            let results = await fetchCustomers();
            customers.current = results;
            setCurrentCustomer(customers.current[0]);
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        asyncWrapper();
    }, []);

    const handleCustomer = (method, e) => {
        switch (method) {
            case 'selectCustomer': {
                let current = customers.current.find(
                    (customer) => customer._id == e.target.value
                );
                setCurrentCustomer(current);
                break;
            }
        }
    };

    return (
        <div className={styles['customer-pane']}>
            <div>
                <label htmlFor="customer">Select Customer</label>
                <select
                    name="customer"
                    id="customer"
                    onChange={(e) => handleCustomer('selectCustomer', e)}
                >
                    {customers.current.map((item, index) => {
                        return (
                            <option
                                key={index}
                                name="currentCustomer"
                                value={item._id}
                            >
                                {item.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <CustomerProfile currentCustomer={currentCustomer} />
            <Calender
                currentCustomer={currentCustomer}
                setFilterObject={setFilterObject}
                transactions={transactions}
            />
            <div className={styles['ticket-table']}>
                <TicketTable
                    filterObject={filterObject}
                    setTransactions={setTransactions}
                />
            </div>
        </div>
    );
};

export default CustomerPane;
