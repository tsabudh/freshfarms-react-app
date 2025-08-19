import classNames from 'classnames/bind';
import React from 'react';
import styles from './FooterHome.module.scss';
import Logo from './UI/Icons/Logo';

const cx = classNames.bind(styles);

export default function FooterHome() {
    return (
        <footer>
            <div className={cx('brand')}>
                <Logo />
                <div className={cx('title')}>
                    <h3 className={cx('h3')}>Freshfarms</h3>
                    <p>The best dairy in town.</p>
                </div>
            </div>
            <div className={cx('copyright')}>
                <p>© 2022 <a href="https://tsabudh.com.np">tsabudh</a> | Sabudh Thapa. All rights reserved.</p>
            </div>
        </footer>
    );
}
