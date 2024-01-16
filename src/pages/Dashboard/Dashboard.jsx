import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import styles from './Dashboard.module.scss';
import { Outlet } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import NavBar from '../../components/NavBar/NavBar';

const Dashboard = (props) => {
    const [sidebarHidden, setSidebarHidden] = useState(false);
    const navigate = useNavigate();
    const { token, setToken } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            console.log('token not available');
            navigate('/login');
        }
    }, [token]);
    return (
        <div className={styles.dashboard}>
            <Sidebar
                sidebarHidden={sidebarHidden}
                setSidebarHidden={setSidebarHidden}
            />
            <div className={styles.window}>
                <NavBar />
                <Outlet />
            </div>
        </div>
    );
};
export default Dashboard;
