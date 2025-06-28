import React from 'react';
import FooterHome from '../../components/FooterHome';
import HeroHome from '../../components/HeroHome';
import SectionAboutHome from '../../components/SectionAboutHome';
import SectionFavoritesHome from '../../components/SectionFavoritesHome';


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
