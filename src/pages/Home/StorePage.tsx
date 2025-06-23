import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './StorePage.module.scss';
import { productImages } from '../../assets/data/productImages.json';

import ProductCard from '../../components/ProductPanel/ProductCard';

import fetchProduct from '../../utils/fetchProducts';
import { Product, ProductImageData } from 'types/product.type';

const cx = classNames.bind(styles);
type ProductImageKeys = keyof typeof productImages;

function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);

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
                    let imageData = productImages[item.name as ProductImageKeys];
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
