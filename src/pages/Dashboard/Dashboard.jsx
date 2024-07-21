import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Dashboard.module.scss';
import { AuthContext } from '../../context/AuthContext';

import Sidebar from '../../components/Sidebar/Sidebar';
import NavBarDash from '../../components/NavBarDash/NavBarDash';
import refreshToken from '../../utils/refreshToken';
import {
    getJwtFromLocalStorage,
    getUserFromLocalStorage,
    setJwtToLocalStorage,
    setUserToLocalStorage,
} from '../../utils/localStorageUtils';

const cx = classNames.bind(styles);

const Dashboard = () => {
    const { jwtToken, setJwtToken, userRole, user, setUser } =
        useContext(AuthContext);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function asyncWrapper() {
            if (jwtToken && user) {
                let response = await refreshToken(jwtToken, userRole);

                if (response.status == 'success') {
                    setJwtToken(() => response.token);
                    setJwtToLocalStorage(response.token);

                    setUser(() => response.user);
                    setUserToLocalStorage(response.user);
                }
            } else {
                navigate('/login');
            }
        }
        asyncWrapper();
    }, []);

    return (
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
    );
};

export default Dashboard;
