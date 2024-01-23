import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import BouncingCircles from '../UI/Vectors/BouncingCircles';
import Button from '../../components/UI/Button/Button';
import styles from './OverlayContainer.module.scss';
import { AuthContext } from '../../context/AuthContext';
import loginAdmin from '../../utils/loginAdmin';

function OverlayContainer({ isNewUser, toggle }) {
    const { setToken } = useContext(AuthContext);
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
        if (response.status == 'success') {
            setToken(response.token);
            localStorage.setItem('token', response.token);
            navigate('/');
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
                <h2>Welcome</h2>
                <p>to</p>
                <h1>Shree Krishna Dairy</h1>
            </div>
            {isNewUser ? (
                <p>If you are a registered user, log in instead.</p>
            ) : (
                <p>If this is your first time, sign up instead.</p>
            )}

            <Button className="stylish02" onClick={() => toggle(!isNewUser)}>
                {isNewUser ? 'Login' : 'Sign Up'}
            </Button>

            <div className={styles['dummy']}>
                <p>Too much hassle?</p>
                <p>
                    <span
                        className={styles['highlighted']}
                        onClick={dummyLogin}
                    >
                        Log in
                    </span>
                    with a dummy account instead.
                </p>
                <div className={styles['placeholder-loader']}>
                    {isLoading && <BouncingCircles height="1em" />}
                </div>
            </div>
        </div>
    );
}
export default OverlayContainer;
