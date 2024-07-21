import React from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';

import NavBarHome from '../../components/NavBarHome/NavBarHome';
import HeroHome from '../../components/HeroHome';
import SectionFavoritesHome from '../../components/SectionFavoritesHome';
import SectionAboutHome from '../../components/SectionAboutHome';
import FooterHome from '../../components/FooterHome';
import { Outlet } from 'react-router-dom';

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
