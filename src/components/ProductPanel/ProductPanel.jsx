import React, { useContext, useEffect, useState } from 'react';
import styles from './ProductPanel.module.scss';
import { AuthContext } from '../../context/AuthContext';
import fetchProducts from '../../utils/fetchProducts';
import Product from '../Product/Product';

function ProductPanel() {
    const { token } = useContext(AuthContext);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const asyncWrapper = async () => {
            const response = await fetchProducts(null, token);
            if (response.status == 'success') {
                setProducts(response.data);
            }
        };
        asyncWrapper();
    }, []);

    return (
        <div className={styles['container']}>
            {products.map((item) => {
                return <Product key={item._id} product={item} />;
            })}
        </div>
    );
}

export default ProductPanel;
