import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './CustomerProfileCard.module.scss';

import Tag from '../UI/Tag/Tag';
import { CustomerProfile } from 'types/customer.interface';

const cx = classNames.bind(styles);

const CustomerProfileCard = ({ customer }:{customer:CustomerProfile}) => {
    const navigate = useNavigate();
    return (
        <div
            className={cx('card')}
            onClick={() => navigate(`/dashboard/customers/${customer._id}`)}
        >
            <div className={cx('card-left')}>
                <div className={cx('card-left-picture')}>
                    <figure>
                        <img src="/img/profile-picture.jpg" alt="Customer" />
                    </figure>
                </div>
            </div>
            <div className={cx('card-right')}>
                <div className={cx('name')}>{customer.name}</div>
                <div className={cx('tab')}>
                    <div className={cx('purchase')}>
                        <p>Purchase</p>
                        {customer.tab.purchase}
                    </div>
                    <div className={cx('paid')}>
                        <p>Paid</p>
                        {customer.tab.paid}
                    </div>
                    <div className={cx('due')}>
                        <p>Due</p>
                        {customer.tab.due}
                    </div>
                </div>
                <div className={cx('phone')}>
                    {customer.phone.map((item) => (
                        <Tag key={item}>{item}</Tag>
                    ))}
                </div>
                <div className={cx('address')}>{customer.address}</div>
            </div>
        </div>
    );
};

export default CustomerProfileCard;
