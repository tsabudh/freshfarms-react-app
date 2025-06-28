import React, { useState,  useReducer } from "react";

import {
  BsSortAlphaDown,
  BsSortAlphaUpAlt,
  BsSortNumericDown,
  BsSortNumericUpAlt,
} from "react-icons/bs";

import { RiSortAsc, RiSortDesc } from "react-icons/ri";

import type { FilterAction, FilterObject, FilterState } from "types/filter.types";
import styles from "./SortAndFilter.module.scss";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import Tag from "../UI/Tag/Tag";

const initialFilterState: FilterState = {
  issuedTime: {
    isOpened: false,
    from: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
    to: Date.now(),
    isSorted: true,
    order: -1,
  },
  products: {
    isOpened: false,
    set: new Set(),
    isSorted: false,
    order: undefined,
  },
  customers: {
    isOpened: false,
    set: new Set(),
    isSorted: false,
    order: undefined,
  },
  totalQuantity: {
    isOpened: false,
    from: 1,
    to: 10,
    isSorted: false,
    order: undefined,
  },
  itemsVariety: {
    isOpened: false,
    from: 0,
    to: 10,
    isSorted: false,
    order: undefined,
  },
};
type FilterKey = keyof typeof initialFilterState;
type MethodOfSort =
  | "issuedTime"
  | "issuedTimeState"
  | "customers"
  | "customersState"
  | "products"
  | "productsState"
  | "totalQuantity"
  | "totalQuantityState"
  | "itemsVariety"
  | "itemsVarietyState";


type InputEvent = React.ChangeEvent<HTMLInputElement>;
type InputOrClickEvent =
  | React.MouseEvent<HTMLButtonElement>
  | React.ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLDivElement>;

const updateSortedState = (
  newFilterState: FilterState,
  key: FilterKey,
  state: boolean
) => {
  newFilterState[key].isSorted = state;
};

const updateOrderState = (
  newFilterState: FilterState,
  key: FilterKey,
  order: string | number
) => {
  newFilterState[key].isSorted = true;
  newFilterState[key].order = parseInt(order as string);
};

const updateOpenedState = (
  newFilterState: FilterState,
  key: FilterKey,
  isOpened: boolean
) => {
  newFilterState[key].isOpened = isOpened;
};

const filterReducer = (
  filterState: FilterState,
  action: FilterAction
): FilterState => {
  const newFilterState = { ...filterState };

  const {
    type,
    update,
    state,
    order,
    from,
    to,
    newProduct,
    selected,
    newCustomer,
  } = action;

  const sortByMappings = {
    issuedTimeState: () =>
      state !== undefined && updateSortedState(newFilterState, "issuedTime", state),
    issuedTime: () =>
      order !== undefined && updateOrderState(newFilterState, "issuedTime", order),
    customersState: () =>
      state !== undefined && updateSortedState(newFilterState, "customers", state),
    customers: () =>
      order !== undefined && updateOrderState(newFilterState, "customers", order),
    productsState: () =>
      state !== undefined && updateSortedState(newFilterState, "products", state),
    products: () =>
      order !== undefined && updateOrderState(newFilterState, "products", order),
    totalQuantityState: () =>
      state !== undefined && updateSortedState(newFilterState, "totalQuantity", state),
    totalQuantity: () =>
      order !== undefined && updateOrderState(newFilterState, "totalQuantity", order),
    itemsVarietyState: () =>
      state !== undefined && updateSortedState(newFilterState, "itemsVariety", state),
    itemsVariety: () =>
      order !== undefined && updateOrderState(newFilterState, "itemsVariety", order),
    default: () => {},
  };

  const issuedTimeMappings = {
    issuedTimeFrom: () => {
      if (from !== undefined) newFilterState.issuedTime.from = from;
    },
    issuedTimeTo: () => {
      if (to !== undefined) newFilterState.issuedTime.to = to;
    },
    remove: () => updateOpenedState(newFilterState, "issuedTime", false),
    default: () => updateOpenedState(newFilterState, "issuedTime", true),
  };

  const productsMappings = {
    productSet: () => {
      if (newProduct) newFilterState.products.set.add(newProduct);
    },
    removeProduct: () => {
      if (selected) newFilterState.products.set.delete(selected);
    },
    remove: () => updateOpenedState(newFilterState, "products", false),
    default: () => updateOpenedState(newFilterState, "products", true),
  };

  const customersMappings = {
    customerSet: () => {
      if (newCustomer) newFilterState.customers.set.add(newCustomer);
    },
    removeCustomer: () => {
      if (selected) newFilterState.customers.set.delete(selected);
    },
    remove: () => updateOpenedState(newFilterState, "customers", false),
    default: () => updateOpenedState(newFilterState, "customers", true),
  };

  const totalQuantityMappings = {
    totalQuantityRangeFrom: () => {
      if (from !== undefined) newFilterState.totalQuantity.from = from;
    },
    totalQuantityRangeTo: () => {
      if (to !== undefined) newFilterState.totalQuantity.to = to;
    },
    remove: () => updateOpenedState(newFilterState, "totalQuantity", false),
    default: () => updateOpenedState(newFilterState, "totalQuantity", true),
  };

  const itemsVarietyMappings = {
    itemsVarietyRangeFrom: () => {
      if (from !== undefined) newFilterState.itemsVariety.from = from;
    },
    itemsVarietyRangeTo: () => {
      if (to !== undefined) newFilterState.itemsVariety.to = to;
    },
    remove: () => updateOpenedState(newFilterState, "itemsVariety", false),
    default: () => updateOpenedState(newFilterState, "itemsVariety", true),
  };

  const actionMappings = {
    sortBy: sortByMappings,
    issuedTime: issuedTimeMappings,
    products: productsMappings,
    customers: customersMappings,
    totalQuantity: totalQuantityMappings,
    itemsVariety: itemsVarietyMappings,
    default: {},
  };

  const typeMappings = actionMappings[type] || actionMappings.default;

  const isValidKey = (key: string): key is keyof typeof typeMappings =>
    key in typeMappings;

  const actionHandler =
    update && isValidKey(update) ? typeMappings[update] : typeMappings.default;

  actionHandler?.(); // safely call handler if exists

  return newFilterState;
};

const applyFilter = (filterState:FilterState, setTransactionFilterObject:React.Dispatch<FilterObject>, customerId:string) => {
  const filterObject:FilterObject = {
    sortBy: {
      issuedTime: filterState.issuedTime.isSorted
        ? filterState.issuedTime.order
        : undefined,
      customer: customerId
        ? undefined
        : filterState.customers.isSorted
        ? filterState.customers.order
        : undefined,
      totalQuantity: filterState.totalQuantity.isSorted
        ? filterState.totalQuantity.order
        : undefined,
      itemsVariety: filterState.itemsVariety.isSorted
        ? filterState.itemsVariety.order
        : undefined,
    },
  };

  if (filterState.issuedTime.isOpened && filterState.issuedTime.from) {
    filterObject.issuedTime = {
      from: new Date(filterState.issuedTime.from),
      to: filterState.issuedTime.to
        ? new Date(filterState.issuedTime.to)
        : new Date(),
    };
  }

  if (filterState.products.isOpened && filterState.products.set.size > 0) {
    filterObject.productArray = Array.from(filterState.products.set);
  }

  if (customerId) {
    filterObject.customerId = customerId;
  } else if (
    filterState.customers.isOpened &&
    filterState.customers.set.size > 0
  ) {
    filterObject.customerArray = Array.from(filterState.customers.set);
  }

  if (filterState.totalQuantity.isOpened) {
    filterObject.totalQuantity = {
      from: parseInt(filterState.totalQuantity.from as string),
      to: parseInt(filterState.totalQuantity.to as string),
    };
  }

  if (filterState.itemsVariety.isOpened) {
    filterObject.itemsVariety = {
      from: parseInt(filterState.itemsVariety.from as string),
      to: parseInt(filterState.itemsVariety.to as string),
    };
  }

  setTransactionFilterObject(filterObject);
};

const SortAndFilter = ({ setTransactionFilterObject, customerId }:{
  setTransactionFilterObject: (Object: FilterObject) => void;
  customerId?: string;
}) => {


  const [sortAndFilterIsOpened, setSortAndFilterIsOpened] = useState(false);

  const [filterState, dispatchFilter] = useReducer<React.Reducer<FilterState, FilterAction>>(
    filterReducer,
    initialFilterState
  );

  const onClose = () => {
    setSortAndFilterIsOpened(false);
  };

  const handleSortBy = (
    method:
      | "issuedTime"
      | "issuedTimeState"
      | "customers"
      | "customersState"
      | "products"
      | "productsState"
      | "totalQuantity"
      | "totalQuantityState"
      | "itemsVariety"
      | "itemsVarietyState",
    e: InputEvent
  ) => {
    const methodMappings = {
      issuedTime: { update: "issuedTime", order: e.target.value },
      issuedTimeState: {
        update: "issuedTimeState",
        state: e.target.checked,
      },
      customers: { update: "customers", order: e.target.value },
      customersState: {
        update: "customersState",
        state: e.target.checked,
      },
      products: { update: "products", order: e.target.value },
      productsState: { update: "productsState", state: e.target.checked },
      totalQuantity: { update: "totalQuantity", order: e.target.value },
      totalQuantityState: {
        update: "totalQuantityState",
        state: e.target.checked,
      },
      itemsVariety: { update: "itemsVariety", order: e.target.value },
      itemsVarietyState: {
        update: "itemsVarietyState",
        state: e.target.checked,
      },
    };

    const action = methodMappings[method];
    if (action) {
      dispatchFilter({
        type: "sortBy",
        ...action,
      });
    }
  };
  const handleIssuedTime = (
    method: "issuedTimeFrom" | "issuedTimeTo" | "remove" | "default",
    e: InputOrClickEvent
  ) => {
    const target = e.target as HTMLInputElement | null;

    const methodMappings = {
      issuedTimeFrom: { update: "issuedTimeFrom", from: target?.value || "" },
      issuedTimeTo: { update: "issuedTimeTo", to: target?.value || "" },
      remove: { update: "remove" },
      default: { update: "default", isOpened: true },
    };

    const action = methodMappings[method] || methodMappings.default;

    if (action) {
      dispatchFilter({
        type: "issuedTime",
        ...action,
      });
    }
  };
  const handleProducts = (
    method: "products" | "removeProduct" | "remove" | "default",
    e: InputOrClickEvent
  ) => {
    const target = e.target as HTMLInputElement | null;
    const value = target?.value || "";
    const methodMappings = {
      products: { update: "productSet", newProduct: value },
      removeProduct: { update: "removeProduct", selected: value },
      remove: { update: "remove" },
      default: { isOpened: true },
    };

    const action = methodMappings[method] || methodMappings.default;
    dispatchFilter({
      type: "products",
      ...action,
    });
  };

  const handleCustomers = (
    method: "removeCustomer" | "remove" | "customers",
    e: InputOrClickEvent,
    _value?: string
  ) => {
    const target = e.target as HTMLInputElement | null;
    const value = _value || target?.value || "";

    const methodMappings = {
      customers: { update: "customerSet", newCustomer: value },
      removeCustomer: { update: "removeCustomer", selected: value },
      remove: { update: "remove" },
      default: {},
    };

    const action = methodMappings[method] || methodMappings.default;
    dispatchFilter({
      type: "customers",
      ...action,
    });
  };

  const handleQuantity = (
    method:
      | "totalQuantityRangeFrom"
      | "totalQuantityRangeTo"
      | "remove"
      | "default",
    e: InputOrClickEvent
  ) => {
    const target = e.target as HTMLInputElement | null;
    const value = target?.value || "";

    const methodMappings = {
      totalQuantityRangeFrom: {
        update: "totalQuantityRangeFrom",
        from: value,
      },
      totalQuantityRangeTo: {
        update: "totalQuantityRangeTo",
        to: value,
      },
      remove: { update: "remove" },
      default: {},
    };

    const action = methodMappings[method] || methodMappings.default;
    dispatchFilter({
      type: "totalQuantity",
      ...action,
    });
  };
  const handleItemsVariety = (
    method:
      | "itemsVarietyRangeFrom"
      | "itemsVarietyRangeTo"
      | "remove"
      | "default",
    e: InputOrClickEvent
  ) => {
    const target = e.target as HTMLInputElement | null;
    const value = target?.value || "";

    const methodMappings = {
      itemsVarietyRangeFrom: {
        update: "itemsVarietyRangeFrom",
        from: value,
      },
      itemsVarietyRangeTo: {
        update: "itemsVarietyRangeTo",
        to: value,
      },
      remove: { update: "remove" },
      default: {},
    };

    const action = methodMappings[method] || methodMappings.default;
    dispatchFilter({
      type: "itemsVariety",
      ...action,
    });
  };

  //* UI Rendering
  return (
    <React.Fragment>
      {sortAndFilterIsOpened ? (
        <Modal isOpen={sortAndFilterIsOpened} onClose={onClose}>
          <div className={styles["sort-and-filter"]}>
            <div className={styles["sort-filter-tab"]}>
              {/* //* Sorting */}
              <div className="wrapper">
                <p>Sort:</p>

                <div className={styles.sort}>
                  <SortIssuedTime
                    filterState={filterState}
                    handleSortBy={handleSortBy}
                  />
                  {customerId ? null : (
                    <SortCustomer
                      filterState={filterState}
                      handleSortBy={handleSortBy}
                    />
                  )}

                  <SortItemVariety
                    filterState={filterState}
                    handleSortBy={handleSortBy}
                  />
                  {/* Total Quantity  */}
                  <SortTotalQuantity
                    filterState={filterState}
                    handleSortBy={handleSortBy}
                  />
                </div>
              </div>
              {/* //* Filtering */}
              <div className={styles.filter}>
                Filters:
                <ul>
                  {/* Date  */}
                  <li>
                    <button
                      onClick={(e) => handleIssuedTime("default", e)}
                      className={styles["filter-btn"]}
                    >
                      Date
                    </button>
                  </li>
                  {/* Products  */}
                  <li>
                    <button
                      onClick={(e) => {
                        handleProducts("default", e);
                      }}
                      className={styles["filter-btn"]}
                    >
                      Products
                    </button>
                  </li>
                  {/* Customers  */}
                  {!customerId && (
                    <li>
                      <button
                        onClick={(e) => handleCustomers("customers", e)}
                        className={styles["filter-btn"]}
                      >
                        Customers
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={(e) => handleQuantity("default", e)}
                      className={styles["filter-btn"]}
                    >
                      Quantity
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => handleItemsVariety("default", e)}
                      className={styles["filter-btn"]}
                    >
                      Items Variety
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/* //* ADDED FILTERS  */}
            <div className={styles["added-filters"]}>
              {filterState.issuedTime.isOpened && (
                <div className={styles["filter-bar"]}>
                  <span>Date:</span>
                  <div className="">
                    <label htmlFor="issuedTimeFrom">From:</label>
                    <input
                      type="datetime-local"
                      id="issuedTimeFrom"
                      value={filterState.issuedTime.from as string}
                      onChange={(e) => handleIssuedTime("issuedTimeFrom", e)}
                    />
                  </div>

                  <div className="">
                    <label htmlFor="issuedTimeTo">To:</label>
                    <input
                      type="datetime-local"
                      id="issuedTimeTo"
                      value={filterState.issuedTime.to as string}
                      onChange={(e) => handleIssuedTime("issuedTimeTo", e)}
                    />
                  </div>

                  <Button
                    className={"primary01"}
                    onClick={(e: InputOrClickEvent) =>
                      handleIssuedTime("remove", e)
                    }
                  >
                    Remove
                  </Button>
                </div>
              )}

              {filterState.products.isOpened && (
                <div className={styles["filter-bar"]}>
                  <span>Products:</span>

                  <div>
                    {Array.from(filterState.products.set).map(
                      (product, index) => (
                        <Tag
                          // className={'primary01'}
                          key={index}
                          onClick={(e: InputOrClickEvent) =>
                            handleProducts("removeProduct", e)
                          }
                        >
                          {product}
                        </Tag>
                      )
                    )}
                  </div>
                  <div className="">
                    <label htmlFor="newProductFilter">
                      Enter to add product:
                    </label>
                    <input type="text" id="newProductFilter" />
                  </div>
                  <Button
                    className={"primary02"}
                    onClick={(e: InputOrClickEvent) => {
                      const inputEl = document.getElementById(
                        "newProductFilter"
                      ) as HTMLInputElement | null;

                      if (!inputEl) return;

                      handleProducts(
                        "products",
                        // 'burger'
                        // inputEl.value.toLowerCase(),
                        e
                      );
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    className={"primary01"}
                    onClick={(e: InputOrClickEvent) =>
                      handleProducts("remove", e)
                    }
                  >
                    Remove
                  </Button>
                </div>
              )}

              {filterState.customers.isOpened && (
                <div className={styles["filter-bar"]}>
                  <span>Customers:</span>
                  <div>
                    {Array.from(filterState.customers.set).map(
                      (customer, index) => (
                        <Tag
                          key={index}
                          onClick={(e: InputOrClickEvent) =>
                            handleCustomers("removeCustomer", e)
                          }
                        >
                          {customer}
                        </Tag>
                      )
                    )}
                  </div>
                  <div className="">
                    <label htmlFor="newCustomerFilter">
                      Enter to add customer:
                    </label>
                    <input type="text" id="newCustomerFilter" />
                  </div>
                  <Button
                    className={"primary02"}
                    onClick={(_: InputOrClickEvent) => {
                      const el = document.getElementById("newCustomerFilter");

                      const value =
                        el && el instanceof HTMLInputElement
                          ? el.value.toLocaleLowerCase()
                          : undefined;

                      if (!value) return;

                      handleCustomers("customers", _, value);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    className={"primary01"}
                    onClick={(e:InputOrClickEvent) => handleCustomers("remove", e)}
                  >
                    Remove
                  </Button>
                </div>
              )}
              {filterState.totalQuantity.isOpened && (
                <div className={styles["filter-bar"]}>
                  <span>Quantity:</span>
                  <div className="">
                    <label htmlFor="quantityRangeFrom">From:</label>
                    <input
                      type="number"
                      id="quantityRangeFrom"
                      defaultValue={1}
                      onChange={(e) =>
                        handleQuantity("totalQuantityRangeFrom", e)
                      }
                    />
                    <label htmlFor="quantityRangeTo">To:</label>
                    <input
                      type="number"
                      id="quantityRangeTo"
                      defaultValue={10}
                      onChange={(e) =>
                        handleQuantity("totalQuantityRangeTo", e)
                      }
                    />
                  </div>

                  <Button
                    className={"primary01"}
                    onClick={(e:InputOrClickEvent) => handleQuantity("remove",e)}
                  >
                    Remove
                  </Button>
                </div>
              )}
              {filterState.itemsVariety.isOpened && (
                <div className={styles["filter-bar"]}>
                  <span>Items Variety:</span>
                  <div className="">
                    <label htmlFor="itemsVarietyRangeFrom">From:</label>
                    <input
                      type="number"
                      id="itemsVarietyRangeFrom"
                      defaultValue={1}
                      onChange={(e) =>
                        handleItemsVariety("itemsVarietyRangeFrom", e)
                      }
                    />
                    <label htmlFor="itemsVarietyRangeTo">To:</label>
                    <input
                      type="number"
                      id="itemsVarietyRangeTo"
                      defaultValue={10}
                      onChange={(e) =>
                        handleItemsVariety("itemsVarietyRangeTo", e)
                      }
                    />
                  </div>
                  <Button
                    className={"primary01"}
                    onClick={(e:InputOrClickEvent) => handleItemsVariety("remove",e)}
                  >
                    Remove
                  </Button>
                </div>
              )}
              <div className={styles["submit-div"]}>
                <Button
                  className={"amber-02 small"}
                  onClick={() => {
                    applyFilter(
                      filterState,
                      setTransactionFilterObject,
                      customerId as string
                    );
                    onClose();
                  }}
                >
                  APPLY FILTER
                </Button>
                <Button
                  className={"amber-01 small"}
                  onClick={() => {
                    applyFilter(
                      initialFilterState,
                      setTransactionFilterObject,
                      customerId as string
                    );
                    onClose();
                  }}
                >
                  RESET FILTER
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {
        <div className={styles["main-button"]}>
          <Button
            className="berry-01 small "
            onClick={() => setSortAndFilterIsOpened((prev) => !prev)}
          >
            Sorts and Filters
          </Button>
        </div>
      }
    </React.Fragment>
  );
};

function SortIssuedTime({ filterState, handleSortBy }:{
  filterState: FilterState;
  handleSortBy: (method: MethodOfSort, e: InputEvent) => void;
}) {
  return (
    <div className={styles["sort-item"]}>
      <input
        type="checkbox"
        checked={filterState.issuedTime.isSorted}
        id="issuedTimeSort"
        onChange={(e) => handleSortBy("issuedTimeState", e)}
      />
      <label
        htmlFor="issuedTimeSort"
        className={filterState.issuedTime.isSorted ? styles["is-sorted"] : ""}
      >
        Date
      </label>
      <ul>
        <li>
          <input
            type="radio"
            id="issuedTimeSortAsc"
            name="issuedTime"
            value="1"
            onChange={(e) => handleSortBy("issuedTime", e)}
          />
          <label
            htmlFor="issuedTimeSortAsc"
            className={
              filterState.issuedTime.isSorted &&
              filterState.issuedTime.order === 1
                ? styles.selected
                : ""
            }
          >
            <RiSortDesc />
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="issuedTimeSortDesc"
            value="-1"
            name="issuedTime"
            onChange={(e) => handleSortBy("issuedTime", e)}
          />
          <label
            htmlFor="issuedTimeSortDesc"
            className={
              filterState.issuedTime.isSorted &&
              filterState.issuedTime.order === -1
                ? styles.selected
                : ""
            }
          >
            <RiSortAsc />
          </label>
        </li>
      </ul>
    </div>
  );
}

function SortCustomer({ filterState, handleSortBy }:{
  filterState: FilterState;
  handleSortBy: (method: MethodOfSort, e: InputEvent) => void;
}) {
  return (
    <div className={styles["sort-item"]}>
      <input
        type="checkbox"
        id="customerSort"
        checked={filterState.customers.isSorted}
        onChange={(e) => handleSortBy("customersState", e)}
      />
      <label
        htmlFor="customerSort"
        className={filterState.customers.isSorted ? styles["is-sorted"] : ""}
      >
        Customer
      </label>
      <ul>
        <li>
          <input
            type="radio"
            id="customerSortAsc"
            name="customers"
            value={"1"}
            onChange={(e) => handleSortBy("customers", e)}
          />
          <label
            htmlFor="customerSortAsc"
            className={
              filterState.customers.isSorted &&
              filterState.customers.order === 1
                ? styles.selected
                : ""
            }
          >
            <BsSortAlphaDown />
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="customerSortDesc"
            name="customers"
            value={"-1"}
            onChange={(e) => handleSortBy("customers", e)}
          />
          <label
            htmlFor="customerSortDesc"
            className={
              filterState.customers.isSorted &&
              filterState.customers.order === -1
                ? styles.selected
                : ""
            }
          >
            <BsSortAlphaUpAlt />
          </label>
        </li>
      </ul>
    </div>
  );
}

function SortItemVariety({ filterState, handleSortBy }:{
  filterState: FilterState;
  handleSortBy: (method: MethodOfSort, e: InputEvent) => void;
}) {
  return (
    <div className={styles["sort-item"]}>
      <input
        type="checkbox"
        id="itemsVarietySort"
        checked={filterState.itemsVariety.isSorted}
        onChange={(e) => handleSortBy("itemsVarietyState", e)}
      />
      <label
        htmlFor="itemsVarietySort"
        className={filterState.itemsVariety.isSorted ? styles["is-sorted"] : ""}
      >
        Variety
      </label>
      <ul>
        <li>
          <input
            type="radio"
            id="itemsVarietySortAsc"
            name="itemsVariety"
            value={"1"}
            onChange={(e) => handleSortBy("itemsVariety", e)}
          />
          <label
            htmlFor="itemsVarietySortAsc"
            className={
              filterState.itemsVariety.isSorted &&
              filterState.itemsVariety.order === 1
                ? styles.selected
                : ""
            }
          >
            <BsSortNumericDown />
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="itemsVarietySortDesc"
            name="itemsVariety"
            value={"-1"}
            onChange={(e) => handleSortBy("itemsVariety", e)}
          />
          <label
            htmlFor="itemsVarietySortDesc"
            className={
              filterState.itemsVariety.isSorted &&
              filterState.itemsVariety.order ===- -1
                ? styles.selected
                : ""
            }
          >
            <BsSortNumericUpAlt />
          </label>
        </li>
      </ul>
    </div>
  );
}

function SortTotalQuantity({ filterState, handleSortBy }:{
  filterState: FilterState;
  handleSortBy: (method: MethodOfSort, e: InputEvent) => void;
}) {
  return (
    <div className={styles["sort-item"]}>
      <input
        type="checkbox"
        id="totalQuantitySort"
        checked={filterState.totalQuantity.isSorted}
        onChange={(e) => handleSortBy("totalQuantityState", e)}
      />
      <label
        htmlFor="totalQuantitySort"
        className={
          filterState.totalQuantity.isSorted ? styles["is-sorted"] : ""
        }
      >
        Quantity
      </label>
      <ul>
        <li>
          <input
            type="radio"
            id="totalQuantitySortAsc"
            name="totalQuantity"
            value={"1"}
            onChange={(e) => handleSortBy("totalQuantity", e)}
          />
          <label
            htmlFor="totalQuantitySortAsc"
            className={
              filterState.totalQuantity.isSorted &&
              filterState.totalQuantity.order === 1
                ? styles.selected
                : ""
            }
          >
            <BsSortNumericDown />
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="totalQuantitySortDesc"
            name="totalQuantity"
            value={"-1"}
            onChange={(e) => handleSortBy("totalQuantity", e)}
          />
          <label
            htmlFor="totalQuantitySortDesc"
            className={
              filterState.totalQuantity.isSorted &&
              filterState.totalQuantity.order === -1
                ? styles.selected
                : ""
            }
          >
            <BsSortNumericUpAlt />
          </label>
        </li>
      </ul>
    </div>
  );
}

export default SortAndFilter;
