import React from 'react';
import styles from './Sidebar.module.scss';

import SidebarItem from './SidebarItem';

import items from '../../assets/data/sidebar.json';

export default function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <figure className={styles['logo']}>
                <img
                    src="img/shree-krishna-dairy-trans.png"
                    alt="Shree Krishna Dairy Logo"
                />
            </figure>

            {items.map((item, index) => (
                <SidebarItem key={index} item={item} />
            ))}
        </div>
    );
}

// const Sidebar = () => {
//     return (
//         <div className={styles.sidebar}>
//             <ul>
//                 <Sidebar text="Home" to="/home"/>
//                 <Sidebar text="Transactions" to="/transactions"/>
//                 <Sidebar text="Monthly Statement" to="/statements"/>
//                 <Sidebar text="Customers" to="/customers"/>
//                 <Sidebar text="Inventory" to="/inventory" />
//             </ul>
//         </div>
//     );
// };
