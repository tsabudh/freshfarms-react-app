import React from 'react';
import styles from './CustomerProfile.module.scss';



const CustomerProfile = ({ currentCustomer }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name:</th>
                        <th>{currentCustomer?.name || 'NA'}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Phone:</td>
                        <td>{currentCustomer?.phone[0] || 'NA'}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>{currentCustomer?.address || 'NA'}</td>
                    </tr>
                    <tr>
                        <td>Dues</td>
                        <td>{currentCustomer?.duePayments || 'NA'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CustomerProfile;
