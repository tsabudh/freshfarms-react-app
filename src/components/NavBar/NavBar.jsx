import React, { useContext, useEffect, useState } from 'react';
import styles from './NavBar.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button/Button';
import { AuthContext } from '../../context/AuthContext';
import fetchMyDetails from '../../utils/fetchMyDetails';

function NavBar(pros) {
    const [admin, setAdmin] = useState({});
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {

        async function asyncWrapper() {
            let responseObject = await fetchMyDetails(token);
            setAdmin(Object.assign({}, responseObject.data));
            console.log(responseObject);
        }
        asyncWrapper();
    },[]);

    const handleLogout = (e) => {
        setToken(null);
        localStorage.removeItem('token');
        setAdmin({});
    };
    return (
        <div className={styles['navigation-bar']}>
            {location.pathname != '/' && (
                <div className={styles['go-back']}>
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
