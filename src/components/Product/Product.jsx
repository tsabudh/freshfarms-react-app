import React from 'react';
import styles from './Product.module.scss';

function Product(props) {
    const { product } = props;
    return (
        <div className={styles['product']}>
            <div className={styles["product_title"]}>{product.name}</div>
            <div className={styles['product_detail']}>
                <div className={styles['key']}>ID</div>
                <div className={styles['value']}>
                    {product._id}
                </div>
            </div>
            <div className={styles['product_detail']}>
                <div className={styles['key']}>Price</div>
                <div className={styles['value']}>
                    {product.price}
                </div>
            </div>
            <div className={styles['product_detail']}>
                <div className={styles['key']}>Stock</div>
                <div className={styles['value']}>
                    {product.stock}
                </div>
            </div>
            <div className={styles['product_detail']}>
                <div className={styles['key']}>Sales</div>
                <div className={styles['value']}>
                    {product.sales}
                </div>
            </div>
            <div className={styles['product_detail']}>
                <div className={styles['key']}>Type</div>
                <div className={styles['value']}>
                    {product.productType}
                </div>
            </div>
        </div>
    );
}
export default Product;
