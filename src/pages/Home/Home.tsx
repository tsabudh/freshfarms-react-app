import classNames from 'classnames/bind';
import React from 'react';

import { Outlet } from 'react-router-dom';
import styles from './Home.module.scss';

import NavBarHome from '../../components/NavBarHome/NavBarHome';


const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('home')}>
            <NavBarHome />

            <div className={cx('window')}>
                <Outlet />
            </div>
        </div>
    );
}

export default Home;
