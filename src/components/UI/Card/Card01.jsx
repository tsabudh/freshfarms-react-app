import React from 'react';

import styles from './Card01.module.scss';

function Card01(props) {
    const { heading, description } = props;

    return (
        <div className={styles.card01}>
            <section className={styles.heading}>
                <h3>{heading}</h3>
            </section>
            <figure className={styles.media}>
            </figure>
        </div>
    );
}
export default Card01;
