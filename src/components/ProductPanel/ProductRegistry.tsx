import classNames from "classnames/bind";
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import API_ROUTE from "@/assets/globals/baseRoute";
import type { Product } from "types/product.type";
import ProductCard from "./ProductCard";
import styles from "./ProductRegistry.module.scss";
import { AuthContext } from "../../context/AuthContext";

import useAPI from "../../hooks/useAPI";
import Button from "../UI/Button/Button";
import ErrorFormFooter from "../UI/Error/ErrorFormFooter";
const cx = classNames.bind(styles);

const _failuresObject = {
  name: false,
  nameMessage: "",
  address: false,
  addressMessage: "",
  stock: true,
  stockMessage: "",
  tab: false,
  purchase: false,
  paid: false,
};

function ProductRegistry() {
  const { jwtToken } = useContext(AuthContext);
  const [, setDueAmount] = useState<string>("");
  const [purchaseAmount] = useState<string>("");
  const [paidAmount] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const createProductFormRef = useRef<HTMLFormElement | null>(null);

  // No requestBody initially, will override in sendRequest call
  const [pendingStatus, data, errorMessage, sendRequest] = useAPI<
    Product,
    Partial<Product>
  >({
    url: `${API_ROUTE}/api/v1/products`,
    method: "POST",
    jwtToken: jwtToken as string,
  });

  useEffect(() => {
    // Update dueAmount based on purchaseAmount and paidAmount
    const purchase = parseFloat(purchaseAmount);
    const paid = parseFloat(paidAmount);
    if (!isNaN(purchase) && !isNaN(paid)) {
      setDueAmount((purchase - paid).toString());
    } else {
      setDueAmount("");
    }
  }, [purchaseAmount, paidAmount]);

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const form = createProductFormRef.current;
      if (!form) throw new Error("Form not found.");

      const formData = new FormData(form);
      const details: Partial<Record<keyof Product, string | number>> = {};

      formData.forEach((value, key) => {
        const typedKey = key as keyof Product;

        if (typeof value !== "string") {
          throw new Error(`Invalid value for ${key}. Expected a string.`);
        }

        const trimmedValue = value.trim();

        switch (typedKey) {
          case "name":
            if (trimmedValue.length < 3) {
              throw new Error(
                "Product name must have at least three characters."
              );
            }
            if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
              throw new Error(
                "Please enter a valid name for product (letters only)."
              );
            }
            details[typedKey] = trimmedValue;
            break;

          case "type":
            if (!/^[a-zA-Z]+$/.test(trimmedValue)) {
              throw new Error(
                "Please enter a valid type for product (letters only)."
              );
            }
            details[typedKey] = trimmedValue;
            break;

          case "stock":
            if (trimmedValue.length === 0) {
              throw new Error("Please enter a stock number.");
            }
            if (!/^\d+$/.test(trimmedValue)) {
              throw new Error("Please enter a valid number for stock.");
            }
            details[typedKey] = Number(trimmedValue);
            break;

          case "price":
            if (trimmedValue.length === 0) {
              throw new Error("Please enter a price.");
            }
            if (!/^\d+(\.\d{1,2})?$/.test(trimmedValue)) {
              throw new Error("Please enter a valid price (e.g., 12.99).");
            }
            details[typedKey] = Number(trimmedValue);
            break;

          default:
            details[typedKey] = trimmedValue;
            break;
        }
      });

      await sendRequest(details as Partial<Product>);
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError("Unknown error!");
    }
  };

  if (!jwtToken) {
    return (
      <div className={cx("container")}>
        <h3>Please login to add a product.</h3>
      </div>
    );
  }

  return (
    <div className={cx("container")}>
      <h3>Add a new product</h3>
      <div className={cx("form-container")}>
        <form
          id="createProductForm"
          ref={createProductFormRef}
          onSubmit={handleForm}
          noValidate
        >
          <InputGroup
            inputName="name"
            fieldName="Name"
            placeholder="Product's Name"
            inputId="productName"
          />
          <InputGroup
            inputName="price"
            fieldName="Price"
            inputId="productPrice"
            placeholder="Price"
          />

          <InputGroup
            inputName="stock"
            fieldName="Stock"
            inputId="productStock"
            placeholder="Stock"
          />
          <InputGroup
            inputName="type"
            fieldName="Type"
            inputId="productType"
            placeholder="Cow, Buffalo, Mixed, Imported"
          />
          <InputGroup
            inputName="code"
            fieldName="Product Code"
            inputId="productCode"
            placeholder="'cm' for cow milk!"
          />
          <InputGroup
            inputName="unit"
            fieldName="Unit of measurement"
            inputId="productUnit"
            placeholder="kg or litre or any"
          />

          <Button
            className="action01 go"
            type="submit"
            disabled={pendingStatus === "sending"}
          >
            {pendingStatus === "sending" ? "Adding..." : "Add product"}
          </Button>
        </form>

        <div>{error}</div>
        <ErrorFormFooter
          pendingStatus={pendingStatus}
          errorMessage={errorMessage as string}
        />
      </div>
      <div className={cx("profile-container")}>
        {data && <ProductCard product={data} />}
      </div>
    </div>
  );
}

interface InputGroupProps {
  fieldName: string;
  inputName: keyof Product | string;
  inputId: string;
  placeholder?: string;
  type?: string;
}

function InputGroup({
  fieldName,
  inputName,
  inputId,
  placeholder,
  type = "text",
}: InputGroupProps) {
  return (
    <div className={cx("input-group")}>
      <label htmlFor={inputId} className={cx("input-label")}>
        {fieldName}
      </label>
      <input
        type={type}
        id={inputId}
        name={inputName}
        className={cx("input-field")}
        placeholder={placeholder}
      />
    </div>
  );
}

export default ProductRegistry;
