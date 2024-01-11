import React, { useState } from 'react';
import TicketPane from '../../components/TransactionPane/TransactionPane';
import Sidebar from '../../components/Sidebar/Sidebar';

import styles from './Dashboard.module.scss';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    const [sidebarHidden, setSidebarHidden] = useState(false);
    return (
        <div className={styles.dashboard}>
            <Sidebar
                sidebarHidden={sidebarHidden}
                setSidebarHidden={setSidebarHidden}
            />
            <div className={styles.window}>
                <Outlet />
            </div>
        </div>
    );
};
export default Dashboard;
