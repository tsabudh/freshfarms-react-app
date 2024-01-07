import React from 'react';
import styles from './Button.module.scss';

const Button = (props) => {
    let classArray, classNames;
    if (props.className) {
        classArray = props.className.split(' ');
        classNames = classArray.map((item) => styles[item]).join(' ');
    }

    return (
        <button
            className={classNames}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;
