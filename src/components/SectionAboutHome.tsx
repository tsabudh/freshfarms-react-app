import React from 'react';

import classNames from 'classnames/bind';
import styles from './SectionAboutHome.module.scss';
import SectionTag from './SectionTag';
import Button from './UI/Button/Button';

const cx = classNames.bind(styles);

export default function SectionAboutHome() {
    return (
        <section className={cx('about')}>
            <SectionTag text={'About'} />
            <div className={cx('content')}>
                <div className={cx('row', 'first')}>
                    <div className={cx('col', 'first')}>
                        <h2 className={cx('h2')}>
                            A dairy that provides fresh products.
                        </h2>
                        <Button className={'berry-01'}>Visit Store</Button>
                    </div>
                    <div className={cx('col', 'second')}>
                        <figure className={cx('figure')}>
                            <img
                                src="/img/ice-cream-2.jpg"
                                alt="Shree Krishna Dairy Building"
                            />
                        </figure>
                    </div>
                </div>
                <div className={cx('row', 'second')}>
                    <div className={cx('col', 'first')}>
                        <figure className={cx('figure')}>
                            <img
                                src="/img/paneer-2.jpg"
                                alt="Shree Krishna Dairy Building"
                            />
                        </figure>
                    </div>
                    <div className={cx('col', 'second')}>
                        <p>
                            At Shree Krishna Dairy, we pride ourselves on
                            providing our community with the freshest and
                            highest quality dairy products. Our commitment to
                            traditional dairy practices, combined with strict
                            hygiene and quality standards, ensures that you
                            receive only the best from us. Our rich, flavorful
                            products are a staple in many households, cherished
                            for their taste and nutritional benefits. We also
                            support local farmers and promote sustainable dairy
                            farming practices, striving to make a positive
                            impact on our community. You can trust in Shree
                            Krishna Dairy for all your dairy needs!
                        </p>
                        <Button className={'berry-01 berry-01--ghost'}>
                            Gallery
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
