import TicketPane from '../../components/TicketPane/TicketPane';
import Sidebar from '../../components/Sidebar/Sidebar';

import styles from './Dashboard.module.scss';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <div className={styles.window}>
                <Outlet />
            </div>
        </div>
    );
};
export default Dashboard;
