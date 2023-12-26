import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SidebarItem.module.scss';
import { SlArrowDown } from 'react-icons/sl';

function SidebarItem({ item }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    if (item.children) {
        return (
            <div
                className={`${styles['sidebar-item']} ${
                    open ? styles['open'] : ''
                }`}
            >
                {/* <div className={open ? "sidebar-item open" : "sidebar-item"}> */}
                <div
                    className={styles['sidebar-title']}
                    onClick={() => setOpen(!open)}
                >
                    <span>
                        {/* ITEM ICON  */}

                        {item.title}
                    </span>
                    <button className={styles['toggle-btn']}>
                        <SlArrowDown />
                    </button>
                </div>
                <div className={styles['sidebar-content']}>
                    {item.children.map((child, index) => (
                        <SidebarItem key={index} item={child} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div
                onClick={() => navigate(item.path)}
                className={`${styles['sidebar-item']} `}
            >
                {item.icon && <i className={item.icon}></i>}
                <div
                    className={`${
                        item.identity === 'menu'
                            ? styles['sidebar-title']
                            : 'plain'
                    }`}
                >
                    <span>{item.title}</span>
                </div>
            </div>
        );
    }
}
export default SidebarItem;
