import React, { useContext, useEffect, useState } from 'react';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMenuSharp } from 'react-icons/io5';
import { GrLogout } from 'react-icons/gr';

import styles from './NavBarDash.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button/Button';
import { AuthContext } from '../../context/AuthContext';
import fetchMyDetails from '../../utils/fetchMyDetails';
import Tooltip from '../UI/Tooltip/Tooltip';

function NavBarDash({ sidebarIsOpen, setSidebarIsOpen }) {
    const { jwtToken, setJwtToken, user, setUser, userRole } =
        useContext(AuthContext);

    const navigate = useNavigate();

    // useEffect(() => {
    //     async function asyncWrapper() {
    //         let responseObject = await fetchMyDetails(jwtToken, userRole);
    //         if (responseObject.status == 'success') {
    //             setUser(Object.assign({}, responseObject.data));
    //         }
    //     }
    //     asyncWrapper();
    // }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setJwtToken(null);
        setUser(null);
        navigate('/login');
    };

    const handleToggle = (e) => {
        setSidebarIsOpen((prev) => !prev);
    };
    return (
        <div className={styles['navigation-bar']}>
            <div
                className={`${styles['toggle-sidebar']} 
                    ${sidebarIsOpen ? styles['toggle-sidebar--open'] : ''}`}
            >
                <IoMenuSharp onClick={handleToggle} />
            </div>

            {location.pathname != '/dashboard' && (
                <div
                    className={`${styles['go-back']} 
                    ${sidebarIsOpen ? '' : styles['go-back--pushed']}`}
                >
                    <Button
                        className="amber-02 small"
                        onClick={() => navigate(-1)}
                    >
                        <span>Go back </span>
                        <RiArrowGoBackFill />
                    </Button>
                </div>
            )}

            <div className={styles['details']}>
                <div className={styles['name']}>{user && user.name}</div>
                <div className={styles['logout']}>
                    <GrLogout onClick={handleLogout} />
                    <Tooltip className={'bottom-left'} text={'Logout'} />
                </div>
            </div>
        </div>
    );
}

export default NavBarDash;
