import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TiUserDeleteOutline } from "react-icons/ti";
import classNames from "classnames/bind";

import styles from "./Customer.module.scss";
import { AuthContext } from "../../context/AuthContext";

import fetchCustomers from "../../utils/fetchCustomers";
import updateCustomer from "../../utils/updateCustomer";
import { fetchTransactions } from "../../utils/fetchTransactions";
import Button from "../UI/Button/Button";
import TransactionTable from "../TransactionTable/TransactionTable";
import SortAndFilter from "../SortAndFilter/SortAndFilter";
import Tag from "../UI/Tag/Tag";
import Tooltip from "../UI/Tooltip/Tooltip";
import deleteCustomer from "../../utils/deleteCustomer";
import fetchMyDetails from "../../utils/fetchMyDetails";
import type {
  CustomerLocation,
  CustomerProfile,
} from "types/customer.interface";

const LazyMapBox = lazy(() => import("../UI/MapBox/MapBox"));

const initialTransactionFilterObject: {
  sortBy: { issuedTime: number };
  customerId: string | null;
} = {
  sortBy: {
    issuedTime: -1,
  },
  customerId: null,
};

const copyText = (e: React.MouseEvent<HTMLElement>) => {
  const target = e.target as HTMLElement;
  navigator.clipboard.writeText(target.innerText.substring(0, 500));
  toast("Copied", {
    position: "top-right",
    theme: "colored",
    toastId: "copyId",
  });
};

const cx = classNames.bind(styles);

function Customer({ customerId }: { customerId?: string | null }) {
  const { jwtToken, user } = useContext(AuthContext);
  const { id: paramId } = useParams();

  const id = customerId || paramId || null;
  if (!id) {
    return <div className={cx("container")}>No customer ID provided.</div>;
  }

  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [transactions, setTransactions] = useState([]);

  initialTransactionFilterObject.customerId = id;
  const [transactionFilterObject, setTransactionFilterObject] = useState(
    initialTransactionFilterObject
  );
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerAddress, setCustomerAddress] = useState<string | null>(null);
  const [customerPhoneArray, setCustomerPhoneArray] = useState<string[]>([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [addedPhones, setAddedPhones] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<CustomerLocation | null>(null);

  //- INITIALIZING CUSTOMER AND TRANSACTIONS
  useEffect(() => {
    const asyncWrapper = async () => {
      if (!user) {
        toast("Please login to continue");
        throw new Error("User not authenticated");
      }
      let customerResponse;
      if (user.role == "admin") {
        customerResponse = await fetchCustomers(id, jwtToken, user.role);
      }
      if (user.role === "customer") {
        customerResponse = await fetchMyDetails(jwtToken, user.role);
      }
      let transactionResults = await fetchTransactions(
        initialTransactionFilterObject,
        jwtToken
      );

      if (customerResponse.status == "success") {
        let customerResponseData = customerResponse.data;
        setCustomer(customerResponseData);
        setCoordinates((prevCoordinates) => {
          //- If customer do not have any coordinates set, return default coordinates of shop
          if (
            customerResponseData.location &&
            customerResponseData.location.coordinates.length != 0
          ) {
            return customerResponseData.location.coordinates;
          } else {
            // Coordinates of dairy shop is set as default
            return [28.27182621011652, 83.60018489346729];
          }
        });
      }

      setTransactions(transactionResults);
    };
    asyncWrapper();
  }, []);

  //- INITIALIZING STATE VARIABLES FOR CUSTOMER ADDRESS AND PHONES
  useEffect(() => {
    if (customer) {
      setCustomerAddress(customer.address);
      setCustomerPhoneArray(customer.phone);
      setCustomerName(customer.name);
    }
  }, [customer]);

  const handleCustomerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };
  const handleCustomerAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerAddress(e.target.value);
  };
  const handleCustomerPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerPhone(e.target.value);
  };
  const deleteStoredPhoneTag = (e: React.MouseEvent<HTMLElement>) => {
    if (!editingStatus) return;

    const target = e.target as HTMLElement;
    const tagText = target.innerText?.toLowerCase();

    let tempCustomerPhoneArray = [...customerPhoneArray];
    const matchedIndex = tempCustomerPhoneArray.findIndex(
      (elem) => elem.toLowerCase() === tagText
    );

    if (matchedIndex >= 0) {
      tempCustomerPhoneArray.splice(matchedIndex, 1);
      setCustomerPhoneArray(tempCustomerPhoneArray);
    }
  };
  const deleteAddedPhoneTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    //- Return if not editing
    if (!editingStatus) return;

    let tempAddedPhones = [...addedPhones];
    let matchedIndex = tempAddedPhones.findIndex(
      (elem) => elem == e.target.innerText.toLowerCase()
    );
    if (matchedIndex >= 0) tempAddedPhones.splice(matchedIndex, 1);
    setAddedPhones(tempAddedPhones);
  };

  const addCustomerPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newPhoneArray: string[] = [...addedPhones];

    let newNumber = customerPhone.toLowerCase().trim();

    //- adding new number to added phone state variable
    let newSet = new Set(newPhoneArray);
    if (newNumber.includes(",")) {
      let numArr = newNumber.split(",");
      numArr.forEach((num) => newSet.add(num));
    } else {
      newSet.add(newNumber);
    }
    setAddedPhones(Array.from(newSet));

    //- clearing input field after addition
    setCustomerPhone("");
    newPhoneArray.push(newNumber);
  };

  const cancelEdits = () => {
    if (!customer) return;
    setCustomerAddress(customer.address);
    setCustomerPhoneArray(customer.phone);
    setCustomerName(customer.name);

    setAddedPhones([]);
    setEditingStatus(false);
  };
  interface CustomerUpdatePayload {
    name?: string | null;
    address?: string | null;
    phone?: string[];
  }
  const saveEdits = async (id: string) => {
    if (!customer || !user) return;
    let customerDetails: CustomerUpdatePayload = {};
    customerDetails.name = customerName;
    customerDetails.address = customerAddress;
    customerDetails.phone = [...addedPhones, ...customerPhoneArray];
    let result = await updateCustomer(id, customerDetails, jwtToken, user.role);
    if (result.status == "success") {
      setCustomer(result.data);
      setEditingStatus(false);
    } else {
      if (result.message) toast(result.message);
      if (result.errors)
        toast(result.errors[0].msg, { toastId: "updateCustomer" });
    }
  };
  const handleDeleteCustomer = async () => {
    let results = await deleteCustomer(id, jwtToken);
    navigate("/dashboard/customers");
  };

  return (
    customer && (
      <div className={cx("container")}>
        <div className={cx("first-row")}>
          <div className={cx("first-row_left")}>
            <div className={cx("profile")}>
              <figure className={cx("profile_picture")}>
                <img src="/img/profile-picture.jpg" alt={customer.name} />
              </figure>
              <span className={cx("profile_name")}>{customer.name}</span>
              <div className={cx("tab")}>
                <div className={cx("purchase")}>
                  <p>Purchase</p>

                  {customer.tab.purchase}
                </div>
                <div className={cx("paid")}>
                  <p>Paid</p>
                  {customer.tab.paid}
                </div>
                <div className={cx("due")}>
                  <p>Due</p>
                  {customer.tab.due}
                </div>
              </div>
            </div>
          </div>

          <div className={cx("first-row_right")}>
            <div className={cx("details")}>
              <div className={cx("detail")}>
                <div className={cx("detail_name")}>Customer ID</div>
                <div className={cx("detail_value")}>
                  <Tag className="orange01" onClick={copyText} title="Copy ID">
                    {customer._id}
                  </Tag>
                  {editingStatus && (
                    <div
                      className={cx("delete")}
                      onClick={handleDeleteCustomer}
                    >
                      <TiUserDeleteOutline />
                      <Tooltip
                        className={"bottom-left"}
                        text={"Delete Customer"}
                      />
                    </div>
                  )}
                </div>
              </div>

              <CustomerDetailField
                detailName={"Name"}
                currentDetail={customer.name}
                inputDetail={customerName || ""}
                eventHandlerFunction={handleCustomerName}
                editingStatus={editingStatus}
              />

              <div className={cx("detail")}>
                <div className={cx("detail_name")}>Phone</div>
                <div className={cx("detail_value")}>
                  {customerPhoneArray.map((item) => (
                    <Tag
                      key={item}
                      className={`${editingStatus ? "" : "inherit-text"}`}
                      onClick={deleteStoredPhoneTag}
                    >
                      {item}
                    </Tag>
                  ))}
                  {editingStatus &&
                    addedPhones.map((item) => (
                      <Tag
                        key={item}
                        className={`${
                          editingStatus ? "green01" : "inherit-text"
                        }`}
                        onClick={deleteAddedPhoneTag}
                      >
                        {item}
                      </Tag>
                    ))}
                  {editingStatus && (
                    <div className={cx("input-wrapper")}>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={handleCustomerPhone}
                        id="phoneToAdd"
                      />
                      <Button onClick={addCustomerPhone} className="sharp01">
                        ADD
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <CustomerDetailField
                detailName={"Address"}
                currentDetail={customer.address}
                inputDetail={customerAddress || ""}
                eventHandlerFunction={handleCustomerAddress}
                editingStatus={editingStatus}
              />
            </div>
            <div className={cx("actions", editingStatus ? "editing" : "")}>
              <Button
                className="action01 wait"
                onClick={() => setEditingStatus(true)}
              >
                Edit
              </Button>
              {editingStatus && (
                <Button className="action01 stop" onClick={() => cancelEdits()}>
                  Cancel
                </Button>
              )}

              {editingStatus && (
                <Button className="action01 go" onClick={() => saveEdits(id)}>
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>

        <CustomerLocation
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />

        <CustomerTransactions
          customer={customer}
          transactionFilterObject={transactionFilterObject}
          setTransactionFilterObject={setTransactionFilterObject}
        />
      </div>
    )
  );
}

function CustomerTransactions({
  setTransactionFilterObject,
  customer,
  transactionFilterObject,
}: {
  setTransactionFilterObject: React.Dispatch<
    React.SetStateAction<{
      sortBy: { issuedTime: number };
      customerId: string | null;
    }>
  >;
  customer: CustomerProfile;
  transactionFilterObject: {
    sortBy: { issuedTime: number };
    customerId: string | null;
  };
}) {
  return (
    <div className={cx("third-row")}>
      <h3>Transactions</h3>
      <div className={cx("transactions")}>
        <SortAndFilter
          setTransactionFilterObject={setTransactionFilterObject}
          customerId={customer._id}
        />
        <TransactionTable transactionFilterObject={transactionFilterObject} />
      </div>
    </div>
  );
}

function CustomerLocation({
  coordinates,
  setCoordinates,
}: {
  coordinates: CustomerLocation | null;
  setCoordinates: React.Dispatch<React.SetStateAction<CustomerLocation | null>>;
}) {
  return (
    <div className={cx("second-row")}>
      {coordinates ? (
        <Suspense fallback={<div>Loading Map...</div>}>
          <LazyMapBox
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

function CustomerDetailField({
  detailName,
  currentDetail,
  inputDetail,
  eventHandlerFunction,
  editingStatus,
}: {
  detailName: string;
  currentDetail: string | null;
  inputDetail: string;
  eventHandlerFunction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingStatus: boolean;
}) {
  return (
    <div className={cx("detail")}>
      <div className={cx("detail_name")}>{detailName}</div>
      <div className={cx("detail_value")}>
        {currentDetail}
        {editingStatus && (
          <div className={cx("input-wrapper")}>
            <input
              type="text"
              value={inputDetail}
              onChange={eventHandlerFunction}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Customer;
