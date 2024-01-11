import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './SigninForm.module.scss';

async function requestAPI(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    const serverUrl = `http://localhost:3000/api/v1/admins/login`;

    let fetchOptions = {
        method: 'post',
        body: JSON.stringify(value),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    let response = await fetch(serverUrl, fetchOptions);

    let temp = await response.json();
    if (response) return temp;
    return new Error('Login Request Failed');
}

const SigninForm = ({ setToken }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        console.log('message');
        navigate('/home');
        return;

        let response = await requestAPI(e);
        let token = await response.token;
        if (response.status == 'success') {
            setToken(() => token);
            console.log(token);
        } else {
            console.log(response);
        }
    }

    return ( false &&
        <div className={styles['signin-container']}>
            <div className={styles['form-container']}>
                <div className={styles['form']}>
                  <h3>Sign In</h3>
                    <div className={styles['input-group']}>
                        <label
                            htmlFor="phone"
                            className={styles['input-label']}
                        >
                            Username
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
                </div>
            </div>
        </div>
    );
};

export default SigninForm;
