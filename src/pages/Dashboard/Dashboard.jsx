import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Dashboard.module.scss';
import { AuthContext } from '../../context/AuthContext';

import Sidebar from '../../components/Sidebar/Sidebar';
import NavBarDash from '../../components/NavBarDash/NavBarDash';

const cx = classNames.bind(styles);

const Dashboard = () => {
    const { jwtToken } = useContext(AuthContext);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!jwtToken) {
            navigate('/login');
        }
    }, [jwtToken]);

    return jwtToken ? (
        <div className={cx('dashboard')}>
            <div className={cx('sidebar-container')}>
                <Sidebar
                    sidebarIsOpen={sidebarIsOpen}
                    setSidebarIsOpen={setSidebarIsOpen}
                />
            </div>

            <div className={cx('window')}>
                <NavBarDash
                    sidebarIsOpen={sidebarIsOpen}
                    setSidebarIsOpen={setSidebarIsOpen}
                />
                <Outlet />
            </div>
        </div>
    ) : null;
};

export default Dashboard;
