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

function NavBarDash(props) {
    const { sidebarIsOpen, setSidebarIsOpen } = props;
    const [admin, setAdmin] = useState({});
    const { jwtToken, setJwtToken } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        async function asyncWrapper() {
            let responseObject = await fetchMyDetails(jwtToken);
            if (responseObject.status == 'success') {
                setAdmin(Object.assign({}, responseObject.data));
            }
        }
        asyncWrapper();
    }, []);

    const handleLogout = (e) => {
        setJwtToken(null);
        localStorage.removeItem('jwtToken');
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
                <IoMenuSharp />
            </div>

            {location.pathname != '/dashboard' && (
                <div
                    className={`${styles['go-back']} 
                    ${sidebarIsOpen ? '' : styles['go-back--pushed']}`}
                >
                    <Button className="stylish06" onClick={() => navigate(-1)}>
                        <span>Go back </span>
                        <RiArrowGoBackFill />
                    </Button>
                </div>
            )}

            <div className={styles['details']}>
                <div className={styles['name']}>{admin && admin.name}</div>
                <div className={styles['logout']} onClick={handleLogout}>
                    <GrLogout />
                    <Tooltip className={'bottom-left'} text={'Logout'} />
                </div>
            </div>
        </div>
    );
}

export default NavBarDash;
