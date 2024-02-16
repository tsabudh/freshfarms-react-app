import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SidebarItem.module.scss';
import { SlArrowDown } from 'react-icons/sl';

function SidebarItem({ item, id, expanded, handleExpand }) {
    const navigate = useNavigate();
   
    if (item.children) {
        return (
            <div
                className={`${styles['sidebar-item']} ${
                    expanded == id ? styles['open'] : ''
                }`}
            >
                {/* <div className={open ? "sidebar-item open" : "sidebar-item"}> */}
                <div className={styles['sidebar-title']} onClick={()=>handleExpand(id)}>
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
                            : styles['plain']
                    }`}
                >
                    <span>{item.title}</span>
                </div>
            </div>
        );
    }
}
export default SidebarItem;
