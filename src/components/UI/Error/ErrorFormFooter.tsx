import React from 'react';
import styles from './ErrorFormFooter.module.scss';

type ErrorFormFooterProps = {
    pendingStatus: 'static' | 'sending' | 'success' | 'failure';
    errorMessage?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function ErrorFormFooter(props: ErrorFormFooterProps) {
    const { pendingStatus, errorMessage } = props; // pendingStatus must be in ['static','sending','success','failure']

    return (
        <div className={styles['form-footer']}>
            {pendingStatus != 'static' ? (
                <span
                    className={`${styles['status']} ${styles[pendingStatus]}`}
                >
                    {pendingStatus == 'success'
                        ? 'SUCCESS'
                        : pendingStatus == 'sending'
                        ? 'REQUESTING'
                        : pendingStatus == 'failure'
                        ? 'FAILED'
                        : ''}
                </span>
            ) : null}
            {errorMessage && (
                <span className={`${styles['error']}`}>{errorMessage}</span>
            )}
        </div>
    );
}

export default ErrorFormFooter;
