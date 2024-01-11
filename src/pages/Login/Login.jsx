import { useState } from 'react';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import OverlayContainer from './OverlayContainer';
import styles from './Login.module.scss';

export default function Login() {
    const [isNewUser, setIsNewUser] = useState(false);

    return (
        <div className={styles['container']}>
            <SigninForm toggle={setIsNewUser} />
            <SignupForm toggle={setIsNewUser} isNewUser={isNewUser}/>

            <OverlayContainer isNewUser={isNewUser} toggle={setIsNewUser} />
        </div>
    );
}
