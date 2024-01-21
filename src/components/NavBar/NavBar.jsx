import React, { useContext, useEffect, useState } from 'react';
import { GoSidebarCollapse } from 'react-icons/go';
import { GoSidebarExpand } from 'react-icons/go';

import styles from './NavBar.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button/Button';
import { AuthContext } from '../../context/AuthContext';
import fetchMyDetails from '../../utils/fetchMyDetails';

function NavBar(props) {
    const { sidebarIsOpen, setSidebarIsOpen } = props;
    const [admin, setAdmin] = useState({});
    const { token, setToken } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        async function asyncWrapper() {
            let responseObject = await fetchMyDetails(token);
            setAdmin(Object.assign({}, responseObject.data));
        }
        asyncWrapper();
    }, []);

    const handleLogout = (e) => {
        setToken(null);
        localStorage.removeItem('token');
        setAdmin({});
    };

    const handleToggle = (e) => {
        setSidebarIsOpen((prev) => !prev);
    };
    return (
        <div className={styles['navigation-bar']}>
            <div
                onClick={handleToggle}
                className={`${styles['toggle-sidebar']} 
                ${sidebarIsOpen ? styles['toggle-sidebar--open'] : ''}`}
            >
                <GoSidebarCollapse />
            </div>

            {location.pathname != '/' && (
                <div
                    className={`${styles['go-back']} 
                    ${sidebarIsOpen ? '' : styles['go-back--pushed']}`}
                >
                    <Button className="stylish06" onClick={() => navigate(-1)}>
                        Go back
                    </Button>
                </div>
            )}

            <div className={styles['details']}>
                <div className={styles['name']}>{admin && admin.name}</div>
                <Button className="stylish02" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default NavBar;
