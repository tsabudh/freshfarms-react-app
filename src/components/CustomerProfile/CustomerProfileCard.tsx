import classNames from "classnames/bind";
import React from "react";
import { useNavigate } from "react-router-dom";

import type { CustomerProfile } from "types/customer.interface";
import styles from "./CustomerProfileCard.module.scss";

import Tag from "../UI/Tag/Tag";

const cx = classNames.bind(styles);

const CustomerProfileCard = ({ customer }: { customer: CustomerProfile }) => {
  const navigate = useNavigate();
  return (
    <div
      className={cx("card")}
      onClick={() => navigate(`/dashboard/customers/${customer._id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/dashboard/customers/${customer._id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={cx("card-left")}>
        <img
          src="/img/card-background-blue.svg"
          alt="svg"
          className={cx("svg-image")}
        />
        <div className={cx("card-left-picture")}>
          <figure>
            <img src="/img/profile-picture.jpg" alt="Customer" />
          </figure>
        </div>
      </div>
      <div className={cx("card-right")}>
        <div className={cx("name")}>{customer.name}</div>
        <div className={cx("phone")}>
          {customer.phone.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
        <div className={cx("address")}>{customer.address}</div>
        <div className={cx("tab")}>
          <div className={cx("purchase")}>
            {customer.tab.purchase}
            <p>Purchase</p>
          </div>
          <div className={cx("paid")}>
            {customer.tab.paid}
            <p>Paid</p>
          </div>
          <div className={cx("due")}>
            {customer.tab.due}
            <p>Due</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileCard;
