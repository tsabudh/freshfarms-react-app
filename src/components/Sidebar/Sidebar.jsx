import styles from './Sidebar.module.scss';

import SidebarItem from './SidebarItem';

import items from '../../assets/data/sidebar.json';

export default function Sidebar() {
    return (
        <div className={styles.sidebar}>
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
