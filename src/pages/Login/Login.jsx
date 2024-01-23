import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import OverlayContainer from '../../components/Overlay/OverlayContainer';
import styles from './Login.module.scss';

export default function Login(props) {
    const [isNewUser, setIsNewUser] = useState(false);
  
    return (
        <div className={styles['container']}>
            <LoginForm
                toggle={setIsNewUser}
                isNewUser={isNewUser}
                setAdmin={props.setAdmin}
                     />

            <OverlayContainer
                isNewUser={isNewUser}
                toggle={setIsNewUser}
                   />
        </div>
    );
}
