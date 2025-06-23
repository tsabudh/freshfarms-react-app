import React from 'react';
import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { IoMdCloseCircle } from 'react-icons/io';

const Modal = ({ isOpen, onClose, children }:{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    if (!isOpen) {
        return null;
    }

    // Stop event propagation from modal to overlay
    const handleModalClick = (e:React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-wrapper']}>
                <div className={styles['modal']} onClick={handleModalClick}>
                    <div className={styles['modal-header']}>
                        <div className={styles['close-button']}>
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
