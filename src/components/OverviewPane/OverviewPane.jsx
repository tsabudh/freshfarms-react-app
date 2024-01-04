import React, { useState, useEffect } from 'react';
import RegisterBoard from '../RegisterBoard/RegisterBoard';
import TicketTable from '../TicketTable/TicketTable';
import styles from './OverviewPane.module.scss';
import Chart from 'chart.js/auto';
import BarChart from '../UI/Chart/BarChart';

function OverviewPane() {
    const initialFilterObject = {
        sortBy: {
            issuedTime: -1,
        },
        limit: 5,
    };
    const [filterObject, setFilterObject] = useState(initialFilterObject);


   
    return (
        <div>
            <h1>Overview</h1>
            <BarChart />
            <RegisterBoard setFilterObject={setFilterObject} />

            <div className={styles['ticket-table-container']}>
                <h3>Latest Transactions</h3>
                <TicketTable filterObject={filterObject} />
            </div>
        </div>
    );
}

export default OverviewPane;
