import React, { useState } from 'react';

import { IoMenuSharp } from 'react-icons/io5';

import { GoSidebarCollapse } from 'react-icons/go';

import styles from './Sidebar.module.scss';

import SidebarItem from './SidebarItem';

import items from '../../assets/data/sidebar.json';
import Button from '../UI/Button/Button';

export default function Sidebar(props) {
    const { sidebarIsOpen, setSidebarIsOpen } = props;
    const [expanded, setExpanded] = useState(null);

    const handleToggle = (e) => {
        setSidebarIsOpen((prev) => !prev);
    };

    const handleExpand = (id) => {
        if (id === expanded) {
            setExpanded('nothing');
        } else {
            setExpanded(id);
        }
    };

    return (
        <div
            className={`${styles.sidebar}  ${
                sidebarIsOpen
                    ? styles['sidebar--opened']
                    : styles['sidebar--closed']
            }`}
        >
            <div className={styles['header']}>
                <div className={styles['hamburger']} onClick={handleToggle}>
                    <IoMenuSharp />
                </div>
                <figure className={styles['logo']}>
                    <img
                        src="/img/shree-krishna-dairy-white.svg"
                        alt="Shree Krishna Dairy Logo"
                    />
                </figure>
            </div>

            {items.map((item, index) => (
                <SidebarItem
                    key={index}
                    item={item}
                    id={index}
                    setExpanded={setExpanded}
                    handleExpand={handleExpand}
                    expanded={expanded}
                />
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
