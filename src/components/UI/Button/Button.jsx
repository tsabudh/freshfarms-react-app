import React from 'react';
import styles from './Button.module.scss';

const Button = (props) => {

let classArray = props.className.split(' ');
let classNames = classArray.map(item=>styles[item]).join(' ')
    return (
        <button
            className={classNames}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export default Button;
