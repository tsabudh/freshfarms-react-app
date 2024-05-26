import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import BouncingCircles from '../UI/Vectors/BouncingCircles';
import Button from '../../components/UI/Button/Button';
import styles from './OverlayContainer.module.scss';
import { AuthContext } from '../../context/AuthContext';
import loginAdmin from '../../utils/loginAdmin';

function OverlayContainer({ isNewUser, toggle }) {
    const { setJwtToken } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function dummyLogin() {
        setErrorMessage(null);
        setIsLoading(true);
        let loginDetails = {
            username: 'john',
            password: '1234',
        };
        let response = await loginAdmin(loginDetails);
        setIsLoading(false);
        if (response.status == 'success' && response.token) {
            setJwtToken(response.token);
            localStorage.setItem('jwtToken', response.token);
            navigate('/dashboard');
        } else if (response.status == 'failure') {
            // setErrorMessage(response.message);
            toast(response.message, { toastId: 'overlayToast' });
        } else setErrorMessage('Something went terribly wrong!');
    }

    return (
        <div
            className={`${styles['overlay']} ${
                isNewUser ? styles['overlay--left'] : styles['overlay--right']
            }`}
        >
            <div className={styles['headings']}>
                <h1>Shree Krishna Dairy</h1>
                <h3>Admin Dashboard</h3>
            </div>
            {isNewUser ? (
                <p>
                    If you are a registered user,
                    <span onClick={() => toggle(!isNewUser)}>Log in</span>
                    instead.
                </p>
            ) : (
                <p>
                    If this is your first time,
                    <span onClick={() => toggle(!isNewUser)}>Sign up</span>
                    instead.
                </p>
            )}

            <div className={styles['dummy']}>
                <p>Too much hassle?</p>

                <div className={styles['highlighted']} onClick={dummyLogin}>
                    <div className={styles['rainbow']}></div>
                    <span>Log in with a dummy account instead.</span>
                </div>

                <div className={styles['placeholder-loader']}>
                    {isLoading && <BouncingCircles height="1em" />}
                </div>
            </div>
        </div>
    );
}
export default OverlayContainer;
