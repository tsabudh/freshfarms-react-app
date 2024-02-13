import React from 'react';

import styles from './NavBarHome.module.scss';

function NavBarHome() {
    return (
        <div className={styles.navbar}>
            <div className=""></div>
            <div className={styles['navbar_menu']}>
                <a href="#">About</a>
                <a href="/login" target="_blank">
                    Login
                </a>
            </div>
        </div>
    );
}

export default NavBarHome;
