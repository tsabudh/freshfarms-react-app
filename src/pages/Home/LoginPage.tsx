import classNames from "classnames/bind";
import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";

import LoginForm from "../../components/LoginForm/LoginForm";
import { AuthContext } from "../../context/AuthContext";
import { openOAuthPopup } from "../../utils/oauth";

const cx = classNames.bind(styles);

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const {setJwtToken} = useContext(AuthContext);
  const navigate = useNavigate();
  

  const handleOAuthLogin = async () => {
    try {
      const token = await openOAuthPopup() as unknown as string;
      if(!token) {
        throw new Error("No token received from OAuth");
      }
      setJwtToken(token); 

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
