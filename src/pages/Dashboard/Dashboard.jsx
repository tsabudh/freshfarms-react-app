import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import styles from './Dashboard.module.scss';
import { Outlet } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import NavBar from '../../components/NavBar/NavBar';

const Dashboard = (props) => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            console.log('token not available');
            navigate('/login');
        }
    }, [token]);

    return (
        token && (
            <div className={styles.dashboard}>
                <div className={styles['sidebar-container']}>
                    <Sidebar
                        sidebarIsOpen={sidebarIsOpen}
                        setSidebarIsOpen={setSidebarIsOpen}
                    />
                </div>

                <div className={styles.window}>
                    <NavBar
                        sidebarIsOpen={sidebarIsOpen}
                        setSidebarIsOpen={setSidebarIsOpen}
                    />
                    <Outlet />
                </div>
            </div>
        )
    );
};
export default Dashboard;
