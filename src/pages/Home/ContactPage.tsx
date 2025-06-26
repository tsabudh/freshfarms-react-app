import React from 'react';
import classNames from 'classnames/bind';

import styles from './ContactPage.module.scss';

const cx = classNames.bind(styles);

function ContactPage() {
    return (
        <section className={cx('contact-container')}>
            <div className={cx('contact')}>
                <h2>Fresh products delivered to your home</h2>
                <div className={cx('direct')}>
                    <p className={cx('title')}>Direct Contacts</p>
                    <ul>
                        <li>
                            <span className={cx('field')}>Phone line 1</span>
                            <span className={cx('value')}>061-500000</span>
                        </li>
                        <li>
                            <span className={cx('field')}>Phone line 2</span>
                            <span className={cx('value')}>9547622222</span>
                        </li>
                        <li>
                            <span className={cx('field')}>Address</span>
                            <span className={cx('value')}>
                                Shree Nagar Tole, Baglung-02, Gandaki, Nepal
                            </span>
                        </li>
                        <li>
                            <span className={cx('field')}></span>
                            <span className={cx('value')}></span>
                        </li>
                    </ul>
                </div>
                <div className={cx('map-address')}>
                    <h3>View on google maps.</h3>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d865.0403213434519!2d83.6002563643794!3d28.271911963615956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1721459711726!5m2!1sen!2snp"
                        width="600"
                        height="450"
                        style={{ border: '1px solid gray' }}
                        allowFullScreen={undefined}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}

export default ContactPage;
