import { NavLink } from 'react-router-dom';

import styles from './Bullet.module.scss';

const Bullet = (props) => {
    return (
        <NavLink to={props.to}>
            <li className={styles.bullet}>{props.text}</li>
        </NavLink>
    );
};

export default Bullet;
