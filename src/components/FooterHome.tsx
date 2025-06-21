import React from 'react';
import classNames from 'classnames/bind';
import styles from './FooterHome.module.scss';
import Logo from './UI/Icons/Logo';

const cx = classNames.bind(styles);

export default function FooterHome() {
    return (
        <footer>
            <div className={cx('brand')}>
                <Logo />
                <div className={cx('title')}>
                    <h3 className={cx('h3')}>Shree Krishna Dairy</h3>
                </div>
            </div>
            <div className={cx('copyright')}>
                <p>© 2022 tsabudh | Sabudh Thapa. All rights reserved.</p>
            </div>
        </footer>
    );
}
