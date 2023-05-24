import styles from './Sidebar.module.scss';

import Bullet from './Bullet/Bullet';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <ul>
                <Bullet text="Home" to="/home"/>
                <Bullet text="Transactions" to="/transactions"/>
                <Bullet text="Monthly Statement" to="/statements"/>
                <Bullet text="Customers" to="/customers"/>
                <Bullet text="Inventory" to="/inventory" />
            </ul>
        </div>
    );
};

export default Sidebar;
