import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './SignupForm.module.scss';
import Button from '../../components/UI/Button/Button';

async function requestAdminSignup(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    const requestURL = `http://localhost:3000/api/v1/admins/signup`;

    let fetchOptions = {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(requestURL, fetchOptions);
    let temp = await response.json();
    if (response) return temp;
    return new Error('Signup Request Failed');
}

const SignupForm = ({ isNewUser, toggle }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {

      
        navigate('/home');
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
                <Button className="stylish01" onClick={handleSubmit}>{isNewUser ? 'Signup' : 'Login'}</Button>
            </div>
        </div>
    );
};

SignupForm.propTypes = {
    toggle: PropTypes.func,
};

export default SignupForm;
