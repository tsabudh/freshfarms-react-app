import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import styles from './HeroHome.module.scss';
import { AuthContext } from '../context/AuthContext';

import loginUser from '../utils/loginUser';
import Button from './UI/Button/Button';
import SectionTag from './SectionTag';
import Logo from './UI/Icons/Logo';

const cx = classNames.bind(styles);

function HeroHome() {
    return (
        <>
            <section className={cx('hero')}>
                <div className={cx('watermark')}>
                    <Logo cx={cx} />
                </div>
                <SectionTag className={''} text={'Shree Krishna Dairy'} />
                <div className={cx('content')}>
                    <h1 className={cx('h1')}>THE BEST DAIRY IN TOWN</h1>
                    <p className={cx("description")}>
                        Shree Krishna Dairy has been providing fresh dairy
                        products to the town people since its opening in 2002.
                        People love us for our quality and fair price. We are
                        better than the competition simply by providing the
                        dairy goods fresh and without any dilutions.
                    </p>

                    <div className={cx('cta')}>
                        <Button className="berry-01">Visit our store</Button>
                        <Button className="berry-01 berry-01 ghost ">
                            Contact us
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HeroHome;
