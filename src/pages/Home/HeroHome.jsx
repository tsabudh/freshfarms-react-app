import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './HeroHome.module.scss';
import Card01 from '../../components/UI/Card/Card01';

import loginAdmin from '../../utils/loginAdmin';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

function HeroHome() {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    async function dummyLogin() {
        let loginDetails = {
            username: 'john',
            password: '1234',
        };
        let response = await loginAdmin(loginDetails);
        if (response.status == 'success') {
            setToken(response.token);
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } else if (response.status == 'failure') {
            // setErrorMessage(response.message);
            toast(response.message, { toastId: 'overlayToast' });
        }
    }
    return (
        <>
            <section className={styles['intro']}>
                <figure className={styles['intro_logo']}>
                    <img
                        src="/img/shree-krishna-dairy-black.png"
                        alt="Shree Krishna Dairy Logo"
                    />
                </figure>

                <div className="wrapper">
                    <div className={styles['intro_title']}>
                        <h1>
                            <span>S</span>
                            <span>H</span>
                            <span>R</span>
                            <span>E</span>
                            <span>E</span>
                            <span> </span>

                            <span>K</span>
                            <span>R</span>
                            <span>I</span>
                            <span>S</span>
                            <span>H</span>
                            <span>N</span>
                            <span>A</span>
                            <span> </span>

                            <span>D</span>
                            <span>A</span>
                            <span>I</span>
                            <span>R</span>
                            <span>Y</span>
                            <span> </span>
                        </h1>
                    </div>

                    <div className={styles['intro_subtitle']}>
                        <p>fresh dairy product</p>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <h2>Remember us for</h2>

                <div className={styles.card_container}>
                    <Card01 heading="Milk" />
                    <Card01 heading="Yogurt" />
                    <Card01 heading="Kurauni" />
                    <Card01 heading="Paneer" />
                    <Card01 heading="Ice cream" />
                </div>
            </section>

            <section className={styles.cta}>
                <a onClick={dummyLogin}>Live Demo</a>
            </section>

            {/* <section className={styles.footer}>
                <div className="contact_us">
                    <div className="map">Map</div>
                    <div className="phone_number">068521687</div>
                    <div className="address">
                        Shree Nagar Tole, Baglung 02, Gandaki Province, Nepal
                    </div>
                </div>
            </section> */}
        </>
    );
}

export default HeroHome;
