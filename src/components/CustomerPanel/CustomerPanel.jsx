import React, { useContext, useEffect, useRef, useState } from 'react';
import Calender from '../Calender/Calender';

import styles from './CustomerPanel.module.scss';
import TicketTable from '../TicketTable/TicketTable';
import CustomerProfile from '../CustomerProfile/CustomerProfile';
import fetchCustomers from '../../utils/fetchCustomers';
import { AuthContext } from '../../context/AuthContext';
let global;

const CustomerPanel = () => {
    const [customers, setCustomers] = useState([]);
    const { token } = useContext(AuthContext);
    useEffect(() => {
        let asyncWrapper = async function () {
            let customerResults = await fetchCustomers(null, token);
            if (customerResults) setCustomers(customerResults);
        };
        asyncWrapper();
    }, []);
    return (
        <>
            <div className={`${styles['card-container']}`}>
                {customers.map((item, index, array) => {
                    return <CustomerProfile  key = {item._id} customer={item} />;
                })}
            </div>
        </>
    );
};

export default CustomerPanel;
