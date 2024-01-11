import React from 'react';
import Button from '../../components/UI/Button/Button';
import styles from './OverlayContainer.module.scss';

function OverlayContainer({ isNewUser, toggle }) {
    return (
        <div
            className={`${styles['overlay']} ${
                isNewUser ? styles['overlay--left'] : styles['overlay--right']
            }`}
        >
            {isNewUser ? (
                <p>If you are a registered user, log in instead.</p>
            ) : (
                <p>If this is your first time, sign up instead.</p>
            )}

            <Button className="stylish02" onClick={() => toggle(!isNewUser)}>
                {isNewUser ? 'Login' : 'Sign Up'}
            </Button>
        </div>
    );
}
export default OverlayContainer;
