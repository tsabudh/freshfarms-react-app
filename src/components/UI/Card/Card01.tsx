import React from 'react';

import styles from './Card01.module.scss';

type Card01Props = {
  heading: string;
  description: string;
} & React.HTMLAttributes<HTMLDivElement>;


function Card01(props:Card01Props) {
    const { heading } = props;

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
