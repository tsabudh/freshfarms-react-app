import classNames from "classnames/bind";
import React, { useState, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import styles from "./Dashboard.module.scss";
import NavBarDash from "../../components/NavBarDash/NavBarDash";
import Sidebar from "../../components/Sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";


const cx = classNames.bind(styles);

const Dashboard = () => {
  const { setUser } = useContext(AuthContext);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  // const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        console.log("Checking auth with cookies:");
        console.log(document.cookie);
        console.log("Response status:", response.status);
        if (response.ok) {
          const data = await response.json();

          console.log("Session is valid:", data);
          setUser(data.user); // You may still store user info in context
        } else {
            console.log("Session is invalid, redirecting to login");
          // navigate("/login");
        }
      } catch (err) {
        console.error("Error validating session:", err);
        // navigate("/login");
      }
    }

    checkAuth();
  }, [setUser]);

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
