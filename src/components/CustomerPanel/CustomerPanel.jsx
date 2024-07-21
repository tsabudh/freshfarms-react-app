import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CustomerPanel.module.scss';
import { AuthContext } from '../../context/AuthContext';

import CustomerProfileCard from '../CustomerProfile/CustomerProfileCard';
import fetchCustomers from '../../utils/fetchCustomers';

const cx = classNames.bind(styles);

const CustomerPanel = () => {
    const { jwtToken } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        let asyncWrapper = async function () {
            let customerResponse = await fetchCustomers(null, jwtToken);
            if (customerResponse.status == 'success') {
                if (customerResponse.data) setCustomers(customerResponse.data);
            }
        };
        asyncWrapper();
    }, []);
    return (
        <>
            <div className={cx('card-container')}>
                {customers.map((item) => {
                    return (
                        <CustomerProfileCard key={item._id} customer={item} />
                    );
                })}
            </div>
        </>
    );
};

export default CustomerPanel;
