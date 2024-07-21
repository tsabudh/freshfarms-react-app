import React, { useContext, useState } from 'react';
import { IoMenuSharp } from 'react-icons/io5';

import styles from './Sidebar.module.scss';
import items from '../../assets/data/sidebar.json';
import { AuthContext } from '../../context/AuthContext';

import SidebarItem from './SidebarItem';
import { NavLink } from 'react-router-dom';
import Logo from '../UI/Icons/Logo';

export default function Sidebar({ sidebarIsOpen, setSidebarIsOpen }) {
    const [expanded, setExpanded] = useState(null);

    const { userRole } = useContext(AuthContext);

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
                    <NavLink to="/">
                        <Logo />
                    </NavLink>
                </figure>
            </div>

            {items.map((item, index) => {
                if (userRole == 'customer' && item.adminOnly) return null;
                return (
                    <SidebarItem
                        key={index}
                        item={item}
                        id={index}
                        setExpanded={setExpanded}
                        handleExpand={handleExpand}
                        expanded={expanded}
                    />
                );
            })}
        </div>
    );
}
