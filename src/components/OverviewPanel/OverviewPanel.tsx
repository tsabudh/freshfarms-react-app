import classNames from 'classnames/bind';
import React, { useContext,  useState } from 'react';

import type { FilterObject } from 'types/filter.types';
import styles from './OverviewPanel.module.scss';

import { AuthContext } from '../../context/AuthContext';
import RegisterBoard from '../RegisterBoard/RegisterBoard';
import TransactionTable from '../TransactionTable/TransactionTable';

const cx = classNames.bind(styles);

const initialTransactionFilterObject = {
    sortBy: {
        issuedTime: -1,
    },
    limit: 5,
};

function OverviewPanel() {
    const [transactionFilterObject, setTransactionFilterObject] = useState<FilterObject>(
        initialTransactionFilterObject
    );
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const { userRole } = useContext(AuthContext);

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
