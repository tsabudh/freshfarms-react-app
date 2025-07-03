import classNames from "classnames/bind";
import React, { useContext, useEffect, useState } from "react";

import type { Product } from "types/product.type";
import ProductCard from "./ProductCard";
import styles from "./ProductPanel.module.scss";
import { productImages } from "../../assets/data/productImages.json";
import { AuthContext } from "../../context/AuthContext";

import { fetchProducts } from "../../utils/fetchProducts";

const cx = classNames.bind(styles);

function ProductPanel() {
  const { jwtToken } = useContext(AuthContext);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const asyncWrapper = async () => {
      if (!jwtToken) return;
      const response = await fetchProducts(undefined, jwtToken);
      if (response.status == "success") {
        setProducts(response.data);
      }
    };
    asyncWrapper();
  }, [jwtToken]);

  return (
    <>
      <h3>Our Products</h3>
      <div className={cx("container")}>
        {products.map((item) => {
          type ProductKey = keyof typeof productImages;
          const imageList = productImages[item.name as ProductKey] || [];

          return (
            <ProductCard key={item._id} product={item} imageData={imageList} />
          );
        })}
      </div>
    </>
  );
}

export default ProductPanel;
