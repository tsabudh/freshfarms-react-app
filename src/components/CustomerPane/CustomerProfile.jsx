import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CustomerProfile.module.scss';

const CustomerProfile = ({ customer }) => {
    const navigate = useNavigate();
    console.log(customer);
    return (
        <div
            className={`${styles['card']}`}
            onClick={() => navigate(`${customer._id}`,{relative:'path'})}
        >
            <div className={`${styles['card-left']}`}>
                <div className={`${styles['card-left-picture']}`}>
                    <figure>
                        <img src="/img/profile-picture.jpg" alt="Customer" />
                    </figure>
                </div>
            </div>
            <div className={`${styles['card-right']}`}>
                <div className={styles['name']}>{customer.name}</div>
                <div className={styles['tab']}>
                    <div className={styles['purchase']}>
                        <p>Purchase</p>

                        {customer.tab.purchase}
                    </div>
                    <div className={styles['paid']}>
                        <p>Paid</p>
                        {customer.tab.paid}
                    </div>
                    <div className={styles['due']}>
                        <p>Due</p>
                        {customer.tab.due}
                    </div>
                </div>
                <div className={styles['phone']}>
                    {customer.phone.map((item) => item)}
                </div>
                <div className={styles['address']}>{customer.address}</div>
            </div>
        </div>
    );
};

export default CustomerProfile;
