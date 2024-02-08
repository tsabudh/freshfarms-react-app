import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './LoginForm.module.scss';
import Button from '../UI/Button/Button';
import loginAdmin from '../../utils/loginAdmin';

import { AuthContext } from '../../context/AuthContext';
import signupAdmin from '../../utils/signupAdmin';
import BouncingCircles from '../UI/Vectors/BouncingCircles';

const LoginForm = ({
    isNewUser,
    toggle,
    setAdmin,
   
}) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { token, setToken } = useContext(AuthContext);
    useEffect(() => {
        if (token) navigate('/dashboard');
    });
    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage(null);
        let form = document.getElementById('loginForm');
        let loginDetails = {};
        let formData = new FormData(form);
        formData.forEach((value, key) => (loginDetails[key] = value));
        if (isNewUser) {
            //- Signing up new user
            setIsLoading(true);
            let response = await signupAdmin(loginDetails);
            console.log(response);
            if (response) setIsLoading(false);
            if (response.status == 'success') {
                console.log('SUCCESSFULLY SIGNED UP ADMIN');
                setIsLoading(false);
                setToken(response.token);
                localStorage.setItem('token', response.token);
                navigate('/dashboard');
            } else if (response.status == 'failure') {
                if (response.message) {
                    setErrorMessage(response.message);
                } else if (response.errors) {
                    setErrorMessage(response.errors[0].msg);
                }
            } else {
                setErrorMessage('Something went wrong on our side.😞');
            }

            return;
        } else {
            //- Logging in user
            setIsLoading(true);
            let response = await loginAdmin(loginDetails);
            console.log(response);
            if (response) setIsLoading(false);
            if (response.status == 'success') {
                setToken(response.token);
                localStorage.setItem('token', response.token);
                navigate('/dashboard');
            } else if (response.status == 'failure') {
                if (response.message) {
                    setErrorMessage(response.message);
                } else if (response.errors) {
                    setErrorMessage(response.errors[0].msg);
                }
            } else {
                setErrorMessage('Something went wrong on our side.😞');
            }
            if (!response) {
                console.log('server error');
            }
        }
        return;
    }

    return (
        <div
            className={`${styles['signup-container']}  ${
                isNewUser
                    ? styles['signup-container--sign-in']
                    : styles['signup-container--sign-up']
            }`}
        >
            <div className={`${styles['form-container']}`}>
                <form id="loginForm" className="form">
                    <h3>{!isNewUser ? 'Log in' : 'Sign up'}</h3>

                    {isNewUser && (
                        <div>
                            <div className={styles['input-group']}>
                                <label
                                    htmlFor="name"
                                    className={styles['input-label']}
                                >
                                    Name
                                </label>
                                <input
                                    className={styles['input-field']}
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={styles['input-group']}>
                                <label
                                    htmlFor="phone"
                                    className={styles['input-label']}
                                >
                                    Phone
                                </label>
                                <input
                                    className={styles['input-field']}
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <div className={styles['input-group']}>
                        <label
                            htmlFor="username"
                            className={styles['input-label']}
                        >
                            Username
                        </label>
                        <input
                            className={styles['input-field']}
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label
                            htmlFor="password"
                            className={styles['input-label']}
                        >
                            Password
                        </label>
                        <input
                            className={styles['input-field']}
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </form>
                <div className={styles['action']}>
                    <Button className="stylish01" onClick={handleSubmit}>
                        {isNewUser ? 'Signup' : 'Login'}
                    </Button>
                    {isLoading && (
                        <BouncingCircles height="2.5rem" width="5rem" />
                    )}
                </div>
                {errorMessage && (
                    <div className={styles['error-message']}>
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
