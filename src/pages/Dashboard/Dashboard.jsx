import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import styles from './Dashboard.module.scss';
import { Outlet } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';

const Dashboard = () => {
    const [sidebarHidden, setSidebarHidden] = useState(false);
    const navigate = useNavigate();
    const { token, setToken } = useContext(AuthContext);

    useEffect(() => {
        console.log('From dashboard');
        if (!token) {
            console.log('token not available');
            navigate('/login');
        }
    }, [token]);
    console.log(location.pathname);
    return (
        <div className={styles.dashboard}>
            <Sidebar
                sidebarHidden={sidebarHidden}
                setSidebarHidden={setSidebarHidden}
            />
            <div className={styles.window}>
                <div className={styles['navigation-bar']}>
                    {location.pathname != '/' && (
                        <div className={styles['go-back']}>
                            <Button
                                className="stylish06"
                                onClick={() => navigate(-1)}
                            >
                                Go back
                            </Button>
                        </div>
                    )}

                    <div className={styles['logo']}>
                        <Button
                            className="stylish02"
                            onClick={() => {
                                setToken(null);
                                localStorage.removeItem('token');
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};
export default Dashboard;
