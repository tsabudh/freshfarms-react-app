import classNames from "classnames/bind";
import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./Dashboard.module.scss";
import NavBarDash from "../../components/NavBarDash/NavBarDash";
import Sidebar from "../../components/Sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import refreshToken from "@/utils/refreshToken";

const cx = classNames.bind(styles);

const Dashboard = () => {
  const { setUser, jwtToken } = useContext(AuthContext);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        if (!jwtToken) throw new Error("Token not found!");
        const data = await refreshToken(jwtToken);
        setUser(data.user);
      } catch (err) {
        console.error("Error validating session:", err);
        localStorage.removeItem("jwtToken");
        navigate("/login"); //TODO going into recursive navigate from login to dashboard in some case, fix it
      }
    }

    checkAuth();
  }, [setUser, navigate, jwtToken]);

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
