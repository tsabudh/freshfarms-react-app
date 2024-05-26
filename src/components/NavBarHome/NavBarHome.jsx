import React from 'react';

import styles from './NavBarHome.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function NavBarHome() {
    return (
        <div className={cx('navbar')}>
            <div className=""></div>
            <div className={styles['navbar_menu']}>
                <a href="/login" target="_blank">
                    Login
                </a>
            </div>
        </div>
    );
}

export default NavBarHome;
