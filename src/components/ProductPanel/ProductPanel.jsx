import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ProductPanel.module.scss';
import { AuthContext } from '../../context/AuthContext';
import { productImages } from '../../assets/data/productImages.json';

import fetchProducts from '../../utils/fetchProducts';
import ProductCard from './ProductCard';

const cx = classNames.bind(styles);

function ProductPanel() {
    const { jwtToken } = useContext(AuthContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const asyncWrapper = async () => {
            const response = await fetchProducts(null, jwtToken);
            if (response.status == 'success') {
                setProducts(response.data);
            }
        };
        asyncWrapper();
    }, []);

    return (
        <div className={cx('container')}>
            {products.map((item) => {
                let imageData = productImages[item.name];
                return (
                    <ProductCard
                        key={item._id}
                        product={item}
                        imageData={imageData}
                    />
                );
            })}
        </div>
    );
}

export default ProductPanel;
