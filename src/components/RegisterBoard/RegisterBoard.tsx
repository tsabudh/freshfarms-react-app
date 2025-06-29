import classNames from "classnames/bind";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { MdOutlineDeleteForever } from "react-icons/md";

import type { CustomerProfile } from "types/customer.interface";
import type { FilterObject } from "types/filter.types";
import type { Product, ProductCartItem } from "types/product.type";
import type { Transaction } from "types/transaction.type";
import styles from "./RegisterBoard.module.scss";
import { AuthContext } from "../../context/AuthContext";

import { fetchCustomers } from "../../utils/fetchCustomers";
import { fetchProducts } from "../../utils/fetchProducts";
import { postTransaction } from "../../utils/postTransactions";
import Button from "../UI/Button/Button";

const cx = classNames.bind(styles);

const RegisterBoard = (props: {
  customers: CustomerProfile[];
  setCustomers: Dispatch<SetStateAction<never[]>>;
  products: ProductCartItem[];
  setProducts: Dispatch<SetStateAction<never[]>>;
  setTransactionFilterObject: (
    filterObject: FilterObject
  ) => void | Dispatch<
    SetStateAction<FilterObject>
  >| Dispatch<
    SetStateAction<Partial<FilterObject>>
  >

}) => {
  const {
    customers,
    setCustomers,
    products,
    setProducts,
    setTransactionFilterObject,
  } = props;
  const { jwtToken, userRole } = useContext(AuthContext);
  const [posting, setPosting] = useState<
    "sending" | "" | "failure" | "success"
  >(""); // sending '' success failure
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<ProductCartItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<
    "purchase" | "payment"
  >("purchase");
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [paidInFull, setPaidInFull] = useState<boolean>(true);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [selectedProductUnit, setSelectedProductUnit] = useState<string | null>(
    null
  );

  useEffect(() => {
    const asyncFunc = async () => {
      if (!jwtToken || !userRole) return;

      const customerResponseObject = await fetchCustomers(
        null,
        jwtToken,
        userRole
      );
      const productResponseObject = await fetchProducts(undefined, jwtToken);

      if (customerResponseObject.status == "success") {
        setCustomers(customerResponseObject.data);
      }
      if (productResponseObject.status == "success") {
        setProducts(productResponseObject.data);
      }
    };
    asyncFunc();
  }, [jwtToken, userRole, setCustomers, setProducts]);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const selected: HTMLSelectElement = document.getElementById(
      "products"
    ) as HTMLSelectElement;
    if (!selected) {
      setErrorMessage("Product selection element not found.");
      return;
    }

    const selectedValue = selected.options[selected.selectedIndex].value;
    if (!selectedValue) {
      setErrorMessage("No product selected.");
      return;
    }

    const selectedItem = products.find((item) => item._id === selectedValue);
    if (!selectedItem) {
      setErrorMessage("Selected product not found.");
      return;
    }

    selectedItem.quantity = Number(quantity);

    const existingItemIndex = cart.findIndex(
      (item) => item._id === selectedValue
    );
    const newCart = [...cart];

    if (existingItemIndex >= 0) {
      newCart[existingItemIndex].quantity += Number(quantity);
    } else {
      newCart.push({ ...selectedItem });
    }

    setCart(newCart);
  };

  const removeFromCart = (_: unknown, id: string) => {
    const newCart = [...cart];
    const found = newCart.findIndex((item) => {
      return item._id == id;
    });

    newCart.splice(found, 1);
    setCart(newCart);
  };

  const addTransaction = async (
    e: React.MouseEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    setPosting("sending");
    setErrorMessage(null);

    const el = document.getElementById("customers") as HTMLSelectElement | null;
    if (!el) {
      setErrorMessage("Customer selection element not found.");
      setPosting("failure");
      return;
    }
    const selectedCustomer = el.value;

    const newTransaction: Partial<Transaction> = {
      customer: { customerId: selectedCustomer },
    };

    if (transactionType === "purchase") {
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        _id: item._id,
        name: item.name,
        priceThen: item.price,
        unit: item.unit,
      }));

      newTransaction.items = items;
      newTransaction.paidInFull = paidInFull;
      newTransaction.paid = paidInFull ? transactionAmount : paidAmount;
      // newTransaction.paidInFull = paidAmount === transactionAmount;
    } else if (transactionType === "payment") {
      newTransaction.type = "payment";
      newTransaction.paid = paidAmount;
    }

    const finalNewTransaction = newTransaction as Transaction;
    const result = await postTransaction(
      finalNewTransaction,
      jwtToken as string
    );

    if (result.status === "success") {
      setPosting("success");
      setErrorMessage(null);
      setPaidAmount(0);
      setCart([]);
      // const productResponse = await fetchProducts(null, jwtToken);
      // setProducts(productResponse.data);
      setTransactionFilterObject({
        sortBy: { issuedTime: -1 },
        limit: 5,
      });
    } else {
      setPosting("failure");
      setErrorMessage(result.message);
    }
  };

  const handlePaidAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaidAmount(Number(e.target.value));
  };

  useEffect(() => {
    const totalAmount = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    }, 0);

    if (paidInFull) setTransactionAmount(totalAmount);
  }, [cart, paidInFull]);

  return (
    <>
      <div className={styles["form-container"]}>
        <h3>Register new transaction {paidInFull}</h3>
        <form action="" id="transactionRegistrationForm">
          <div className={styles["tab-container"]}>
            <div
              className={`${styles["tab"]} ${styles["purchase"]} ${
                transactionType == "purchase" ? styles.active : ""
              }`}
              onClick={() => setTransactionType("purchase")}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTransactionType("purchase");
                }
              }}
              role="button"
            >
              Purchase
            </div>
            <div
              className={`${styles["tab"]} ${styles["payment"]} ${
                transactionType == "payment" ? styles.active : ""
              }`}
              onClick={() => setTransactionType("payment")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTransactionType("payment");
                }
              }}
            >
              Payment
            </div>
          </div>
          {transactionType == "purchase" ? (
            <PurchaseUI
              customers={customers}
              setSelectedProductUnit={setSelectedProductUnit}
              setPaidInFull={setPaidInFull}
              setQuantity={setQuantity}
              products={products}
              quantity={quantity}
              selectedProductUnit={selectedProductUnit}
              addToCart={addToCart}
              cart={cart}
              removeFromCart={removeFromCart}
              paidInFull={paidInFull}
              transactionAmount={transactionAmount}
              posting={posting}
              addTransaction={addTransaction}
              handlePaidAmount={handlePaidAmount}
              paidAmount={paidAmount}
            />
          ) : (
            <PaymentUI
              customers={customers}
              addTransaction={addTransaction}
              handlePaidAmount={handlePaidAmount}
              posting={posting}
              paidAmount={paidAmount}
            />
          )}
        </form>
        <div className={styles["form-footer"]}>
          {posting != "" ? (
            <span className={`${styles["status"]} ${styles[posting]}`}>
              {posting == "success"
                ? "SUCCESS"
                : posting == "sending"
                ? "CREATING"
                : posting == "failure"
                ? "FAILED"
                : ""}
            </span>
          ) : null}
          {errorMessage && (
            <span className={`${styles["error-message"]}`}>{errorMessage}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterBoard;

function Cart({
  cart,
  removeFromCart,
  transactionAmount,
}: {
  cart: ProductCartItem[];
  removeFromCart: (
    e: React.MouseEvent | React.KeyboardEvent,
    id: string
  ) => void;
  transactionAmount: number;
}) {
  return (
    <div className={styles["cart"]}>
      {/* //* HEAD */}
      {cart.length > 0 ? (
        <div className={`${styles["cart-item"]} ${styles["cart-item--head"]}`}>
          <div
            className={`${styles["cart-item-piece--head"]} ${styles["cart-item-piece"]} ${styles["cart-item-piece--name"]}`}
          >
            <span className={styles["cart-item-piece-label"]}>Item</span>
          </div>
          <div
            className={`${styles["cart-item-piece--head"]} ${styles["cart-item-piece"]} ${styles["cart-item-piece--price"]}`}
          >
            <span className={styles["cart-item-piece-label"]}>Unit price</span>
          </div>
          <div
            className={`${styles["cart-item-piece--head"]} ${styles["cart-item-piece"]} ${styles["cart-item-piece--quantity"]}`}
          >
            <span className={styles["cart-item-piece-label"]}>Quantity</span>
          </div>
          <div
            className={`${styles["cart-item-piece--head"]} ${styles["cart-item-piece"]} ${styles["cart-item-piece--quantity"]}`}
          >
            <span className={styles["cart-item-piece-label"]}>Price</span>
          </div>
          <div
            className={`${styles["cart-item-piece--head"]} ${styles["cart-item-piece"]} ${styles["cart-item-piece--delete"]}`}
          >
            <span className={styles["cart-item-piece-delete"]}></span>
          </div>
        </div>
      ) : null}

      {cart.map((item) => {
        return (
          <CartItem
            item={item}
            key={item._id}
            removeFromCart={removeFromCart}
          />
        );
      })}

      {cart.length > 0 ? (
        <div className={cx("total-price")}>
          <span className={cx("label")}>Total Price:</span>
          <span className={cx("price")}>{transactionAmount}</span>
        </div>
      ) : null}
    </div>
  );
}

function CartItem(props: {
  item: ProductCartItem;
  removeFromCart: (
    e: React.MouseEvent | React.KeyboardEvent,
    id: string
  ) => void;
}) {
  const { item, removeFromCart } = props;
  return (
    <div className={styles["cart-item"]} key={item._id}>
      {/* <div
                className={`${styles['cart-item-piece']} ${styles['cart-item-piece--id']}`}
            >
                <span className={styles['cart-item-piece-value']}>
                    {item._id}
                </span>
            </div> */}
      <div
        className={`${styles["cart-item-piece"]} ${styles["cart-item-piece--name"]}`}
        title={item._id}
      >
        <span className={styles["cart-item-piece-value"]}>{item.name}</span>
      </div>
      <div
        className={`${styles["cart-item-piece"]} ${styles["cart-item-piece--price"]}`}
      >
        <span className={styles["cart-item-piece-value"]}>{item.price}</span>
      </div>

      <div
        className={`${styles["cart-item-piece"]} ${styles["cart-item-piece--quantity"]}`}
      >
        <span className={styles["cart-item-piece-value"]}>{item.quantity}</span>
      </div>

      <div
        className={`${styles["cart-item-piece"]} ${styles["cart-item-piece--price"]}`}
      >
        <span className={styles["cart-item-piece-value"]}>
          {item.price * item.quantity}
        </span>
      </div>
      <div
        className={`${styles["cart-item-piece"]} ${styles["cart-item-piece--delete"]}`}
      >
        <span
          className={styles["cart-item-piece-delete"]}
          onClick={(e) => {
            removeFromCart(e, item._id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              removeFromCart(e, item._id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <MdOutlineDeleteForever />
        </span>
      </div>
    </div>
  );
}

function PurchaseUI({
  customers,
  setSelectedProductUnit,
  setPaidInFull,
  //   setPaidAmount,
  setQuantity,
  products,
  quantity,
  selectedProductUnit,
  addToCart,
  cart,
  removeFromCart,
  paidInFull,
  transactionAmount,
  posting,
  addTransaction,
  handlePaidAmount,
  paidAmount,
}: {
  customers: Partial<CustomerProfile>[];
  setSelectedProductUnit: React.Dispatch<React.SetStateAction<string | null>>;
  setPaidInFull: (paidInFull: boolean) => void;
  //   setPaidAmount: (amount: number) => void;
  setQuantity: (quantity: number) => void;
  products: Product[];
  quantity: number;
  selectedProductUnit: string | null;
  addToCart: (e: React.MouseEvent) => void;
  cart: ProductCartItem[];
  removeFromCart: (
    e: React.MouseEvent | React.KeyboardEvent,
    id: string
  ) => void;
  paidInFull: boolean;
  transactionAmount: number;
  posting: "sending" | "" | "failure" | "success";
  addTransaction: (
    e: React.MouseEvent<HTMLInputElement | HTMLButtonElement>
  ) => Promise<void>;
  handlePaidAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paidAmount: number;
}) {
  return (
    <div className={styles["purchase-dash"]}>
      <div className={styles["form-group"]}>
        <label htmlFor="customers">Customer :</label>
        <select name="" id="customers">
          {customers &&
            customers.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
        </select>
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="products">Add Items:</label>
        <select
          name="products"
          id="products"
          onChange={(e) => {
            setSelectedProductUnit(products[e.target.selectedIndex].unit);
          }}
        >
          {products?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="">
          <input
            type="number"
            id="productQuantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
          />
          <span className={styles["unit"]}>{selectedProductUnit}</span>
        </div>

        <Button className="amber-03 ghost small" onClick={addToCart}>
          add
        </Button>
      </div>

      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        transactionAmount={transactionAmount}
      />

      <div className={styles["form-group"]}>
        <div className={styles["pay"]}>
          <div className={styles["type"]}>
            Paid in full?
            <div className={styles["grouped"]}>
              <input
                name="paidInFull"
                type="radio"
                id="paidInFullYes"
                onChange={() => setPaidInFull(true)}
                value={"true"}
                checked={paidInFull == true}
              />

              <label htmlFor="paidInFullYes">
                <span
                  className={`${styles["custom-radio"]} ${styles.yes}`}
                  tabIndex={0}
                  onKeyDown={(_e) => {
                    setPaidInFull(true);
                  }}
                  role="button"
                ></span>
                <span>Yes</span>
              </label>
            </div>
            <div className={styles["grouped"]}>
              <input
                name="paidInFull"
                type="radio"
                id="paidInFullNo"
                onChange={() => setPaidInFull(false)}
                value={"false"}
                checked={paidInFull == false}
              />

              <label htmlFor="paidInFullNo">
                <span
                  className={`${styles["custom-radio"]} ${styles.no}`}
                  tabIndex={0}
                  onKeyDown={(_e) => {
                    setPaidInFull(false);
                  }}
                  role="button"
                ></span>
                <span>No</span>
              </label>
            </div>
          </div>

          <div className={styles["amount"]}>
            <span>Paid :</span>
            {paidInFull ? (
              <input
                type="number"
                value={transactionAmount}
                id="paidAmount"
                readOnly={true}
                width={`${transactionAmount.toString().length}ch`}
              />
            ) : (
              <input
                type="number"
                id="paidAmount"
                value={paidAmount}
                onChange={handlePaidAmount}
              />
            )}
          </div>
        </div>
      </div>

      <Button
        className={cx(`berry-02`, `small`, {
          loading: posting == "sending",
        })}
        onClick={addTransaction}
      >
        ADD TRANSACTION
      </Button>
    </div>
  );
}

function PaymentUI({
  customers,
  addTransaction,
  handlePaidAmount,
  posting,
  paidAmount,
}: {
  customers: Partial<CustomerProfile>[];
  addTransaction: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  handlePaidAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  posting: "sending" | "" | "failure" | "success";
  paidAmount: number;
}) {
  return (
    <div className={styles["payment-dash"]}>
      <div className={styles["form-group"]}>
        <label htmlFor="customers">Customer :</label>
        <select id="customers">
          {customers.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="paid">Paid :</label>
        <input
          type="number"
          value={paidAmount}
          id="paid"
          onChange={handlePaidAmount}
        />
      </div>
      <Button
        className={cx(`berry-02`, `small`, {
          loading: posting == "sending",
        })}
        onClick={addTransaction}
      >
        ADD TRANSACTION
      </Button>
    </div>
  );
}
