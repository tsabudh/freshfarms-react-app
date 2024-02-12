import React from 'react';

import styles from './Tooltip.module.scss';

function Tooltip(props) {
    let classArray, classNames;
    let defaultClass = styles['tooltip'];

    if (props.className) {
        classArray = props.className.split(' ');
        classNames = classArray.map((item) => styles[item]).join(' ');
    }

    let { className = null, ...dynamicProps } = { ...props };

    return (
        <div className={defaultClass + ' ' + classNames} {...dynamicProps}>
            <div className="wrapper">
                <span>{props.text}</span>
            </div>
        </div>
    );
}
export default Tooltip;
