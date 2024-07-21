import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './LoginPage.module.scss';

import LoginForm from '../../components/LoginForm/LoginForm';
import OverlayContainer from '../../components/Overlay/OverlayContainer';

const cx = classNames.bind(styles);

export default function LoginPage() {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className={cx('container')}>
            <LoginForm
                toggle={setIsAdmin}
                isAdmin={isAdmin}
                
                
            />

        </div>
    );
}
