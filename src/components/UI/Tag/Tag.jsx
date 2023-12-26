import React from 'react';
import styles from './Tag.module.scss';

const Tag = (props) => {
    return (
        <div
            
            className={`${styles[`tag`]} ${styles[`${props.className}`]} `}
            onClick={props.onClick}
        >
            {props.children}
        </div>
        // <div className={styles[`tag ${props.className}`]} onClick={props.onClick}>{props.children}</div>
    );
};

export default Tag;
