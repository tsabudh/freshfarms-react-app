import React, { useContext } from "react";
import { GrLogout } from "react-icons/gr";
import { IoMenuSharp } from "react-icons/io5";
import { RiArrowGoBackFill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import styles from "./NavBarDash.module.scss";
import { AuthContext } from "../../context/AuthContext";
import Button from "../UI/Button/Button";
import Tooltip from "../UI/Tooltip/Tooltip";

function NavBarDash({
  sidebarIsOpen,
  setSidebarIsOpen,
}: {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setJwtToken, user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setJwtToken(null);
    setUser(null);
    navigate("/login");
  };

  const handleToggle = () => {
    setSidebarIsOpen((prev) => !prev);
  };
  return (
    <div className={styles["navigation-bar"]}>
      <div
        className={`${styles["toggle-sidebar"]} 
                    ${sidebarIsOpen ? styles["toggle-sidebar--open"] : ""}`}
      >
        <IoMenuSharp onClick={handleToggle} />
      </div>

      {location.pathname != "/dashboard" && (
        <div
          className={`${styles["go-back"]} 
                    ${sidebarIsOpen ? "" : styles["go-back--pushed"]}`}
        >
          <Button className="amber-02 small" onClick={() => navigate(-1)}>
            <span>Go back </span>
            <RiArrowGoBackFill />
          </Button>
        </div>
      )}

      <div className={styles["details"]}>
        <div className={styles["name"]}>{user && user.name}</div>
        <div className={styles["logout"]}>
          <GrLogout onClick={handleLogout} />
          <Tooltip className={"bottom-left"} text={"Logout"} />
        </div>
      </div>
    </div>
  );
}

export default NavBarDash;
