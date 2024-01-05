import React, { useEffect, useRef, useState } from 'react';
import Calender from '../Calender/Calender';

import styles from './CustomerPane.module.scss';
import TicketTable from '../TicketTable/TicketTable';
import CustomerProfile from './CustomerProfile';
import fetchCustomers from '../../utils/fetchCostumers';
let global;

const CustomerPane1 = () => {
    const [currentCustomer, setCurrentCustomer] = useState(null);

    let customers = useRef([]);

    let asyncWrapper = async () => {
        try {
            let results = await fetchCustomers();
            customers.current = results;
            console.log(results);
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
                    {customers?.current.map((item, index) => {
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
            {customers.current.map((item) => {
                return <p>{item.name}</p>;
            })}
        </div>
    );
};

const CustomerPane = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        let asyncWrapper = async function () {
            let customerResults = await fetchCustomers();
            if (customerResults) setCustomers(customerResults);
        };
        asyncWrapper();
    }, []);
    return (
        <>
            <div className={`${styles['card-container']}`}>
                {customers.map((item, index, array) => {
                    return <CustomerProfile customer={item} />;
                })}
            </div>
        </>
    );
};

export default CustomerPane;
