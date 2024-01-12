import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import Button from '../UI/Button/Button';
import loginAdmin from '../../utils/loginAdmin';

import { AuthContext } from '../../context/AuthContext';

const LoginForm = ({ isNewUser, toggle }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { token, setToken } = useContext(AuthContext);
    useEffect(() => {
        if (token) navigate('/');
    });
    async function handleSubmit(e) {
        e.preventDefault();
        let form = document.getElementById('loginForm');
        let loginDetails = {};
        let formData = new FormData(form);
        formData.forEach((value, key) => (loginDetails[key] = value));
        if (isNewUser) {
            return;
        } else {
            console.log(loginDetails);
            let response = await loginAdmin(loginDetails);
            console.log(response);
            if (response.status == 'success') {
                setToken(response.token);
                localStorage.setItem('token', response.token);
            }
            navigate('/');
        }
        return;
    }

    return (
        <div className={styles['signup-container']}>
            <div
                className={`${styles['form-container']} ${
                    isNewUser
                        ? styles['form-container--sign-in']
                        : styles['form-container--sign-up']
                }`}
            >
                <form id="loginForm" className="form">
                    <h3>{!isNewUser ? 'Login' : 'SignUp'}</h3>

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
                                    onChange={(e) => setPhone(e.target.value)}
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
                            </div>{' '}
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
                <Button className="stylish01" onClick={handleSubmit}>
                    {isNewUser ? 'Signup' : 'Login'}
                </Button>
            </div>
        </div>
    );
};

export default LoginForm;
