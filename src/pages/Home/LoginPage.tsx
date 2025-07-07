import classNames from "classnames/bind";
import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";

import LoginForm from "../../components/LoginForm/LoginForm";
import Button from "../../components/UI/Button/Button";
import { AuthContext } from "../../context/AuthContext";
import {
  getJwtFromLocalStorage,
  getUserFromLocalStorage,
  setJwtToLocalStorage,
} from "../../utils/localStorageUtils";
import { openOAuthPopup } from "../../utils/oauth";
import { refreshToken } from "../../utils/refreshToken";

const cx = classNames.bind(styles);

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { setJwtToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOAuthLogin = async () => {
    try {
      const token = (await openOAuthPopup()) as unknown as string;
      if (!token) {
        throw new Error("No token received from OAuth");
      }
      console.log("Tasks on popup done.");
      setJwtToken(token);
      setJwtToLocalStorage(token);

      navigate("/dashboard");
    } catch (err) {
      console.error("OAuth failed:", err);
    }
  };

  useEffect(() => {
    const refreshTokenWrapper = async () => {
      const locallyStoredToken = getJwtFromLocalStorage();
      const locallyStoredUser = getUserFromLocalStorage();

      if (!(locallyStoredToken && locallyStoredUser)) return;
      const response = await refreshToken(locallyStoredToken);

      const refreshedUser = response.user;
      const refreshedToken = response.token;
      if (!(refreshedUser && refreshedToken)) return;

      setUser(refreshedUser);
      setJwtToken(refreshedToken);
      navigate("/dashboard");
    };

    refreshTokenWrapper();
  }, [setJwtToken, setUser, navigate]);

  return (
    <div className={cx("container")}>
      <div className={cx("wrapper")}>
        <LoginForm toggle={setIsAdmin} isAdmin={isAdmin} />

        {process.env.NODE_ENV !== "production" && (
          <div className={cx("oauth-container")}>
            <Button onClick={handleOAuthLogin}>Login with OAuth</Button>
          </div>
        )}
      </div>
    </div>
  );
}
