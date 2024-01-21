import React from 'react';
import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { IoMdCloseCircle } from 'react-icons/io';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-wrapper']}>
                <div className={styles['modal']} onClick={handleModalClick}>
                    <div className={styles['modal-header']}>
                        <div className={styles["close-button"]}>

                        <IoMdCloseCircle onClick={onClose} />
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
