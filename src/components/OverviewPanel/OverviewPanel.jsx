import React, { useState, useEffect } from 'react';
import RegisterBoard from '../RegisterBoard/RegisterBoard';
import TransactionTable from '../TransactionTable/TransactionTable';
import styles from './OverviewPanel.module.scss';
import Chart from 'chart.js/auto';
import BarChart from '../UI/Chart/BarChart';

function OverviewPanel() {
    const initialFilterObject = {
        sortBy: {
            issuedTime: -1,
        },
        limit: 5,
    };
    const [filterObject, setFilterObject] = useState(initialFilterObject);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);

    return (
        <div className={styles['overview-panel']}>
            <h1>Overview</h1>
            {/* <BarChart products={products} setProducts={setProducts} /> */}
            <RegisterBoard
                setFilterObject={setFilterObject}
                products={products}
                setProducts={setProducts}
                customers={customers}
                setCustomers={setCustomers}
            />

            <div className={styles['transaction-table-container']}>
                <h3>Latest Transactions</h3>
                <TransactionTable filterObject={filterObject} />
            </div>
        </div>
    );
}

export default OverviewPanel;
