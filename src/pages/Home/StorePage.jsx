import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './StorePage.module.scss';
import { productImages } from '../../assets/data/productImages.json';

import ProductCard from '../../components/ProductPanel/ProductCard';

import fetchProduct from '../../utils/fetchProducts';

const cx = classNames.bind(styles);

function StorePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function asyncWrapper() {
            let productResponseObject = await fetchProduct();
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
                    let imageData = productImages[item.name];
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
