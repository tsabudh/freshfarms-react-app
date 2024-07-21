import React from 'react';
import classNames from 'classnames/bind';
import styles from './SectionTag.module.scss';

const cx = classNames.bind(styles);

export default function SectionTag({ text, className }) {

    return (
        <div className={cx('section-tag', className?.split(' '))}>
            {text || 'Shree Krishna Dairy'}
        </div>
    );
}
