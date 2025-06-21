import React from 'react';

import classNames from 'classnames/bind';

import styles from './ProductCard.module.scss';
import { slides } from '../../assets/data/carouselA.json';

import CarouselB from '../CarouselB';
import { Product, ProductImageData } from 'types/product.type';

const cx = classNames.bind(styles);

function ProductCard({ product, imageData }:{
    product: Product | null;
    imageData: ProductImageData[];
}) {
    if (!product) return null;

    return (
        <div className={cx('product-card')}>
            <section className={cx('product')}>
                <section className={cx('product_image')}>
                    <CarouselB data={imageData} />
                </section>
                <section className={cx('product_details')}>
                    <h4 className={cx('name')}>{product.name}</h4>
                    <p className={cx('description')}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quidem laboriosam consequuntur dolores provident quis,
                        mollitia, eius a magni nisi placeat velit maxime
                        pariatur ut numquam excepturi rerum molestias vero
                        tempora.
                    </p>

                    <div className={cx('footer')}>
                        <p className={cx('unit')}>per {product.unit}</p>
                        <div className={cx('price')}>Rs. {product.price}</div>
                    </div>
                </section>
            </section>
        </div>
    );
}
export default ProductCard;
