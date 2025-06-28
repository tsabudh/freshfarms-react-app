import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import styles from './OverlayContainer.module.scss';
import { AuthContext } from '../../context/AuthContext';
import loginUser from '../../utils/loginUser';
import Button from '../UI/Button/Button';
import BouncingCircles from '../UI/Vectors/BouncingCircles';

function OverlayContainer({ isNewUser, toggle }:{
    isNewUser: boolean;
    toggle: (isNewUser: boolean) => void;
}) {
    const { setJwtToken } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function dummyLogin() {
        setErrorMessage(null);
        setIsLoading(true);
        const loginDetails = {
            username: 'john',
            password: '1234',
        };
        const response = await loginUser(loginDetails);
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
                <h1>Freshfarms</h1>
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
