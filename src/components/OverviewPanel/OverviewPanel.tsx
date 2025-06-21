import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './OverviewPanel.module.scss';

import RegisterBoard from '../RegisterBoard/RegisterBoard';
import TransactionTable from '../TransactionTable/TransactionTable';
import { AuthContext } from '../../context/AuthContext';

const cx = classNames.bind(styles);

const initialTransactionFilterObject = {
    sortBy: {
        issuedTime: -1,
    },
    limit: 5,
};

function OverviewPanel() {
    const [transactionFilterObject, setTransactionFilterObject] = useState(
        initialTransactionFilterObject
    );
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const { userRole, user } = useContext(AuthContext);

    const isAdmin = userRole === 'admin';

  
    return (
        <div className={cx('overview-panel')}>
            <h1>Overview</h1>
            {isAdmin && (
                <RegisterBoard
                    setTransactionFilterObject={setTransactionFilterObject}
                    products={products}
                    setProducts={setProducts}
                    customers={customers}
                    setCustomers={setCustomers}
                />
            )}

            <div className={cx('transaction-table-container')}>
                <h3>Latest Transactions</h3>

                <TransactionTable
                    transactionFilterObject={transactionFilterObject}
                />
            </div>
        </div>
    );
}

export default OverviewPanel;
