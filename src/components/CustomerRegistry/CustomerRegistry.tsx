import classNames from "classnames/bind";
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { CustomerProfile } from "types/customer.interface";
import styles from "./CustomerRegistry.module.scss";
import { AuthContext } from "../../context/AuthContext";
import useAPI from "../../hooks/useAPI";

import CustomerProfileCard from "../CustomerProfile/CustomerProfileCard";
import Button from "../UI/Button/Button";
import ErrorFormFooter from "../UI/Error/ErrorFormFooter";
import API_ROUTE from "@/assets/globals/baseRoute";

const cx = classNames.bind(styles);

const _failuresObject = {
  name: false,
  nameMessage: "",
  address: false,
  addressMessage: "",
  phone: true,
  phoneMessage: "",
  tab: false,
  purchase: false,
  paid: false,
};

function CustomerRegistry() {
  const { jwtToken } = useContext(AuthContext);

  const profileContainerRef = useRef<HTMLDivElement>(null);
  const createCustomerFormRef = useRef<HTMLFormElement>(null);

  const [dueAmount, setDueAmount] = useState<string>("");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [tabOptions, setTabOptions] = useState(false);

  const [error, setError] = useState<string | null>(null);

  let requestBody;
  const [pendingStatus, data, errorMessage, sendRequest] = useAPI<
    CustomerProfile,
    Partial<CustomerProfile>
  >({
    url: `${API_ROUTE}/api/v1/customers/all`,
    method: "POST",
    jwtToken: jwtToken as string,
    body: requestBody,
  });

  useEffect(() => {
    const purchaseAmountNumber = parseFloat(purchaseAmount);
    const paidAmountNumber = parseFloat(paidAmount);
    setDueAmount((purchaseAmountNumber - paidAmountNumber).toString());
  }, [purchaseAmount, paidAmount]);

  useEffect(() => {
    if (pendingStatus == "success" && profileContainerRef.current) {
      profileContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pendingStatus]);

  const handleTab = () => {
    setTabOptions((tabOptions) => !tabOptions);
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const form = createCustomerFormRef.current!;
      const formData = new FormData(form);

      const details: Partial<CustomerProfile> = {};

      formData.forEach((value, key) => {
        const typedKey = key as keyof Pick<
          CustomerProfile,
          "name" | "username" | "address" | "password"
        >;

        if (typeof value !== "string") {
          throw new Error(`Unexpected non-string value for key: ${key}`);
        }

        const trimmedValue = value.trim();

        switch (typedKey) {
          case "name": {
            if (trimmedValue.length < 3) {
              throw new Error("Name must have at least three characters.");
            }
            const nameRegex = /^[a-zA-Zà-žÀ-Ž' -]+$/;
            if (!nameRegex.test(trimmedValue)) {
              throw new Error("Please enter a valid name.");
            }
            break;
          }
          case "username": {
            if (trimmedValue.length < 3) {
              throw new Error("Username must have more than three characters.");
            }
            const regex = /^[^a-zA-Z]/;
            if (regex.test(trimmedValue)) {
              throw new Error("Invalid username, please start with a letter.");
            }
            break;
          }
          case "password": {
            if (formData.get("password") !== formData.get("confirmPassword")) {
              throw new Error("Password and Confirm Password did not match.");
            }
            break;
          }
          case "address": {
            if (trimmedValue.length === 0) {
              throw new Error("Address is required.");
            }
            break;
          }
        }

        // Assign after validation
        if (trimmedValue) {
          details[typedKey] = trimmedValue as CustomerProfile[typeof typedKey];
        }
      });

      sendRequest(details);

      return;
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
    }
  };

  return (
    <div className={cx("container")}>
      <h3 className={cx("h3")}>Add a new customer</h3>
      <div className={cx("form-container")}>
        <form action="" id="createCustomerForm" ref={createCustomerFormRef}>
          <InputGroup
            inputName="name"
            fieldName="Name"
            placeholder="Customer's Name"
            inputId="customerName"
          />
          <InputGroup
            inputName="username"
            fieldName="Username"
            inputId="customerUsername"
            placeholder="Username"
          />
          <InputGroup
            inputName="password"
            fieldName="Password"
            inputId="customerPassword"
            placeholder="********"
            type="password"
          />
          <InputGroup
            inputName="confirmPassword"
            fieldName="Confirm Password"
            inputId="customerConfirmPassword"
            placeholder="********"
            type="password"
          />
          <InputGroup
            inputName="address"
            fieldName="Address"
            inputId="customerAddress"
            placeholder="Street, City, District, Province, Country"
          />
          <InputGroup
            inputName="phone"
            fieldName="Phone Number"
            inputId="customerPhone"
            placeholder="Phone numbers separated by commas."
          />

          <CustomerTabOptions
            tabOptions={tabOptions}
            handleTab={handleTab}
            dueAmount={dueAmount}
            setPaidAmount={setPaidAmount}
            setPurchaseAmount={setPurchaseAmount}
          />
          <Button className="action01 go" onClick={handleForm}>
            Add customer
          </Button>
        </form>

        <div>{error}</div>
        <ErrorFormFooter
          pendingStatus={pendingStatus}
          errorMessage={errorMessage || undefined}
        />
      </div>
      <div className={cx("profile-container")} ref={profileContainerRef}>
        {data && <CustomerProfileCard customer={data} />}
      </div>
    </div>
  );
}

function InputGroup({
  fieldName,
  inputName,
  inputId,
  placeholder,
  type = "text",
}: {
  fieldName: string;
  inputName: string;
  inputId: string;
  placeholder?: string;
  type?: "text" | "password" | "email";
}) {
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

function CustomerTabOptions({
  tabOptions,
  handleTab,
  dueAmount,
  setPurchaseAmount,
  setPaidAmount,
}: {
  tabOptions: string | boolean;
  handleTab: () => void;
  dueAmount: string;
  setPurchaseAmount: (value: string) => void;
  setPaidAmount: (value: string) => void;
}) {
  return (
    <div className={cx("advanced-container")}>
      <div className={cx("input-group", "input-group--check")}>
        <label htmlFor="customerTab" className={cx("input-label--check")}>
          More Options
        </label>
        <input
          type="checkbox"
          className={cx("input-field--check")}
          id="customerTab"
          name="tab"
          value={tabOptions as string} //TODO : fix this type
          onChange={handleTab}
        />
      </div>

      {tabOptions && (
        <div className={cx("advanced-group")}>
          <CustomerTabInputGroup
            labelName={"Purchased"}
            inputId={"purchase"}
            inputName={"purchase"}
            placeholder={"Purchased Amount"}
            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPurchaseAmount(e.target.value)
            }
            classNameModifier={"input-field--purchase"}
          />

          <CustomerTabInputGroup
            labelName={"paid"}
            inputId={"paid"}
            inputName={"paid"}
            placeholder={"Paid Amount"}
            onChangeFunction={(e) => setPaidAmount(e.target.value)}
            classNameModifier={"input-field--paid"}
          />

          <CustomerTabInputGroup
            labelName={"Due"}
            inputId={"due"}
            inputName={"due"}
            placeholder={"Due Amount"}
            readOnly={true}
            classNameModifier={"input-field--due"}
            inputValue={dueAmount}
          />
        </div>
      )}
    </div>
  );
}

function CustomerTabInputGroup({
  labelName,
  inputId,
  inputName,
  placeholder,
  onChangeFunction,
  classNameModifier,
  ...otherProps
}: {
  labelName: string;
  inputId: string;
  inputName: string;
  placeholder?: string;
  onChangeFunction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classNameModifier?: string;
  readOnly?: boolean;
  inputValue?: string;
}) {
  const { readOnly, inputValue } = otherProps;
  return (
    <div className={cx(["input-group", "input-group--tab"])}>
      <label htmlFor={inputId} className={cx("input-label")}>
        {labelName}
      </label>
      <input
        id={inputId}
        name={inputName}
        type="text"
        className={cx("input-field", classNameModifier)}
        placeholder={placeholder}
        onChange={onChangeFunction}
        readOnly={readOnly}
        value={inputValue}
      />
    </div>
  );
}

export default CustomerRegistry;
