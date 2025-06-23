import React from 'react';
import styles from './Tag.module.scss';

type TagProps = {
    title?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Tag: React.FC<TagProps> = (props) => {
    let classArray, classNames;
    if (props.className) {
        classArray = props.className.split(' ');
        classArray.push('tag');
        classNames = classArray.map((item) => styles[item]).join(' ');
    } else {
        classNames = styles['tag'];
    }
    return (
        <div
            title={props.title}
            className={classNames}
            // className={`${styles[`tag`]} ${styles[`${props.className}`]} `}
            onClick={props.onClick}
        >
            {props.children}
        </div>
        // <div className={styles[`tag ${props.className}`]} onClick={props.onClick}>{props.children}</div>
    );
};

export default Tag;
