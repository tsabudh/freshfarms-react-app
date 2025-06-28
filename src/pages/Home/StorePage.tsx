import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';

import type { Product } from 'types/product.type';
import styles from './StorePage.module.scss';
import { productImages } from '../../assets/data/productImages.json';

import ProductCard from '../../components/ProductPanel/ProductCard';

import {fetchProducts} from '../../utils/fetchProducts';

const cx = classNames.bind(styles);
type ProductImageKeys = keyof typeof productImages;

function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function asyncWrapper() {
            const productResponseObject = await fetchProducts();
            if (productResponseObject.status == 'success') {
                setProducts(() => productResponseObject.data);
            }
        }

        asyncWrapper();
    }, []);

    return (
        <div className={cx('products-container')}>
            <h2>Our products</h2>
            <div className={cx('products')}>
                {products.map((item, index) => {
                    const imageData = productImages[item.name as ProductImageKeys];
                    return (
                        <div key={item.name + index}>
                            <ProductCard product={item} imageData={imageData} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StorePage;
