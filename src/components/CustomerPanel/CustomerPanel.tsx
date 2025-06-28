import classNames from 'classnames/bind';
import React, { useContext, useEffect, useState } from 'react';

import { CustomerProfile } from 'types/customer.interface';
import styles from './CustomerPanel.module.scss';
import { AuthContext } from '../../context/AuthContext';

import fetchCustomers from '../../utils/fetchCustomers';
import CustomerProfileCard from '../CustomerProfile/CustomerProfileCard';

const cx = classNames.bind(styles);

const CustomerPanel = () => {
    const { jwtToken } = useContext(AuthContext);
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);

    useEffect(() => {
        const asyncWrapper = async function () {
            const customerResponse = await fetchCustomers(null, jwtToken);
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
