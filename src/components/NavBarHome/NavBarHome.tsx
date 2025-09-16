import classNames from "classnames/bind";
import React from "react";

import { NavLink } from "react-router-dom";
import styles from "./NavBarHome.module.scss";
import Logo from "../UI/Icons/Logo";
const cx = classNames.bind(styles);

function NavBarHome() {
  return (
    <section className={cx("navbar")}>
      <div className={cx("brand")}>
        <NavLink to="/">
          <Logo cx={cx} />
        </NavLink>
      </div>
      <nav className={styles["navbar_menu"]}>
        <ul>
          <li>
            <NavLink to="/contact">contact</NavLink>
          </li>

          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default NavBarHome;
