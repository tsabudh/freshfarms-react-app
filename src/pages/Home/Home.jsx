import React from 'react';
import styles from './Home.module.scss';
import NavBarHome from '../../components/NavBarHome/NavBarHome';
import HeroHome from './HeroHome';

function Home() {
    return (
        <div>
            <NavBarHome />
            <HeroHome/>
           
        </div>
    );
}

export default Home;
