import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Dashboard.module.scss";
import { AuthContext } from "../../context/AuthContext";

import Sidebar from "../../components/Sidebar/Sidebar";
import NavBarDash from "../../components/NavBarDash/NavBarDash";
import refreshToken from "../../utils/refreshToken";
import {
  getJwtFromLocalStorage,
  getUserFromLocalStorage,
  setJwtToLocalStorage,
  setUserToLocalStorage,
} from "../../utils/localStorageUtils";

const cx = classNames.bind(styles);

const Dashboard = () => {
  const { jwtToken, setJwtToken, user, setUser } = useContext(AuthContext);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function asyncWrapper() {
      try {
        if (jwtToken && user) {
          let response = await refreshToken(jwtToken, user.role);

          if (response.status == "success") {
            setJwtToken(() => response.token);
            setJwtToLocalStorage(response.token);

            setUser(() => response.user);
            setUserToLocalStorage(response.user);
          } else {
            navigate("/login");
          }
        } else {
          console.log("No JWT token or user found in context");
          navigate("/login");
        }
      } catch (error) {
        console.log(error.message);
        navigate("/login");
      }
    }
    // asyncWrapper();
    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/check", {
          method: "GET",
          credentials: "include", // ⚠️ Send cookies with the request
        });

        console.log("Response status:", response.status);
        if (response.ok) {
          const data = await response.json();

          console.log("Session is valid:", data);
          setUser(data.user); // You may still store user info in context
        } else {
            console.log("Session is invalid, redirecting to login");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error validating session:", err);
        navigate("/login");
      }
    }

    checkAuth();
  }, []);

  return (
    <div className={cx("dashboard")}>
      <div className={cx("sidebar-container")}>
        <Sidebar
          sidebarIsOpen={sidebarIsOpen}
          setSidebarIsOpen={setSidebarIsOpen}
        />
      </div>

      <div className={cx("window")}>
        <NavBarDash
          sidebarIsOpen={sidebarIsOpen}
          setSidebarIsOpen={setSidebarIsOpen}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
