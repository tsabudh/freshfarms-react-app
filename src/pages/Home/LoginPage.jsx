import React, { useContext, useState } from "react";
import classNames from "classnames/bind";

import styles from "./LoginPage.module.scss";

import LoginForm from "../../components/LoginForm/LoginForm";
import OverlayContainer from "../../components/Overlay/OverlayContainer";
import { openOAuthPopup, redirectToAuth } from "../../utils/oauth";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const {setJwtToken, setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleOAuthLogin = async () => {
    try {
      const token = await openOAuthPopup();
      // localStorage.setItem("access_token", token);
      setJwtToken(token); // or dispatch to global auth context

      navigate("/dashboard");
    } catch (err) {
      console.error("OAuth failed:", err);
    }
  };

  return (
    <div className={cx("container")}>
      <LoginForm toggle={setIsAdmin} isAdmin={isAdmin} />

      <button onClick={handleOAuthLogin}>Login with OAuth</button>
    </div>
  );
}
