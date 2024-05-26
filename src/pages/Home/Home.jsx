import React from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';

import NavBarHome from '../../components/NavBarHome/NavBarHome';
import HeroHome from './HeroHome';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('home')}>
            <NavBarHome />
            <HeroHome />
        </div>
    );
}

export default Home;
