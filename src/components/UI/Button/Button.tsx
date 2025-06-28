import React from 'react';
import styles from './Button.module.scss';

const Button = (props:React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    let classArray, classNames;
    if (props.className) {
        classArray = props.className.split(' ');
        classNames = classArray.map((item) => styles[item]).join(' ');
    }

    const { className:_discarded = null, ...dynamicProps } = { ...props };

    return (
        <button className={classNames} {...dynamicProps}>
            {props.children}
        </button>
    );
};

export default Button;
