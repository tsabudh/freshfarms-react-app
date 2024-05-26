import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CustomerPanel.module.scss';
import { AuthContext } from '../../context/AuthContext';

import CustomerProfile from '../CustomerProfile/CustomerProfile';
import fetchCustomers from '../../utils/fetchCustomers';

const cx = classNames.bind(styles);

const CustomerPanel = () => {
    const { jwtToken } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        let asyncWrapper = async function () {
            let customerResults = await fetchCustomers(null, jwtToken);
            if (customerResults) setCustomers(customerResults);
        };
        asyncWrapper();
    }, []);
    return (
        <>
            <div className={cx('card-container')}>
                {customers.map((item) => {
                    return <CustomerProfile key={item._id} customer={item} />;
                })}
            </div>
        </>
    );
};

export default CustomerPanel;
