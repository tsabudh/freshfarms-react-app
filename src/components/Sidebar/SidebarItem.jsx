import { NavLink } from 'react-router-dom';

import styles from './SidebarItem.module.scss';

// const SidebarItem = (props) => {
//     return (
//         <NavLink to={props.to}>
//             <li className={styles["sidebar-item"]}>{props.text}</li>
//         </NavLink>
//     );
// };
import { useState } from 'react';

function SidebarItem({ item }) {
    const [open, setOpen] = useState(false);

    if (item.children) {
        return (
            <div className={`${styles["sidebar-item"]} ${open ? styles['open'] : ''}`}>
                {/* <div className={open ? "sidebar-item open" : "sidebar-item"}> */}
                <div className={styles['sidebar-title']}>
                    <span>
                       {/* ITEM ICON  */}
                        {item.title}
                    </span>
                    <button
                        className={styles["toggle-btn"]}
                        onClick={() => setOpen(!open)}
                    >^</button>
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
            <a href={item.path || '#'} className={`${styles["sidebar-item"]} ${styles['plain']}`}>
                {item.icon && <i className={item.icon}></i>}
                {item.title}
            </a>
        );
    }
}
export default SidebarItem;
