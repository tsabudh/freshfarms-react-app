import React from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';

import HeroHome from '../../components/HeroHome';
import SectionFavoritesHome from '../../components/SectionFavoritesHome';
import SectionAboutHome from '../../components/SectionAboutHome';
import FooterHome from '../../components/FooterHome';

const cx = classNames.bind(styles);

function LandingPage() {
    return (
        <>
            <HeroHome />
            <SectionFavoritesHome />
            <SectionAboutHome />
            <FooterHome />
        </>
    );
}

export default LandingPage;
