import React, { useState } from 'react';
import { CgMoveLeft } from 'react-icons/cg';
import { GoSidebarExpand } from 'react-icons/go';
import { GoSidebarCollapse } from 'react-icons/go';

import styles from './Sidebar.module.scss';

import SidebarItem from './SidebarItem';

import items from '../../assets/data/sidebar.json';
import Button from '../UI/Button/Button';

export default function Sidebar(props) {
    const { sidebarIsOpen, setSidebarIsOpen } = props;
    const handleToggle = (e) => {
        setSidebarIsOpen((prev) => !prev);
    };
    return (
        <div
            className={`${styles.sidebar} ${
                sidebarIsOpen
                    ? styles['sidebar--opened']
                    : styles['sidebar--closed']
            }`}
        >
            <div className={styles['hamburger']} onClick={handleToggle}>
                <GoSidebarExpand />
            </div>
            <figure className={styles['logo']}>
                <img
                    src="/img/shree-krishna-dairy-trans.png"
                    alt="Shree Krishna Dairy Logo"
                />
            </figure>

            {items.map((item, index) => (
                <SidebarItem key={index} item={item} />
            ))}
        </div>
    );
}

// sidebarIsOpen ? (
//     <div className={styles['hamburger']}>
//         <Button onClick={handleToggle}>TOGGLE</Button>
//     </div>
// ) : (
//     ''
// );
