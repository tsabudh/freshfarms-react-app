import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./LoginForm.module.scss";
import { AuthContext } from "../../context/AuthContext";

import Button from "../UI/Button/Button";
import loginUser from "../../utils/loginUser";
import BouncingCircles from "../UI/Vectors/BouncingCircles";
import refreshToken from "../../utils/refreshToken";
import {
  setJwtToLocalStorage,
  setUserToLocalStorage,
} from "../../utils/localStorageUtils";

const cx = classNames.bind(styles);

const LoginForm = ({
  isAdmin,
  toggle,
}: {
  isAdmin: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginFormRef = useRef(null);

  const navigate = useNavigate();

  const { jwtToken, setJwtToken, user, setUser } = useContext(AuthContext);

  useEffect(() => {
    async function asyncWrapper() {
      try {
        if (jwtToken && user?.role) {
          let response = await refreshToken(jwtToken, user.role);
          if (response.status == "success") {
            setJwtToken(response.token);
            setJwtToLocalStorage(response.token);
            setUser(response.user);
            setUserToLocalStorage(response.user);
            navigate("/dashboard");
          } else {
            navigate("/login");
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
    asyncWrapper();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    let form: HTMLFormElement =
      loginFormRef.current as unknown as HTMLFormElement;
    let loginDetails: { [key: string]: FormDataEntryValue } = {};
    let formData = new FormData(form);
    formData.forEach((value, key) => (loginDetails[key] = value));

    const userRole = isAdmin ? "admin" : "customer";
    setIsLoading(true);
    loginDetails.username = (
      loginDetails.username as string
    ).toLocaleLowerCase();

    let response = await loginUser(loginDetails, userRole);
    if (response) setIsLoading(false);

    if (response.status == "success") {
      setIsLoading(false);
      setJwtToken(response.token);
      setUser(response.user);
      setJwtToLocalStorage(response.token);
      setUserToLocalStorage(response.user);

      navigate("/dashboard");
    } else if (response.status == "failure") {
      if (response.message) {
        setErrorMessage(response.message);
      } else if (response.errors) {
        setErrorMessage(response.errors[0].msg);
      }
    } else {
      setErrorMessage("Something went wrong on our side.😞");
    }

    return;
  }

  return (
    <div className={cx("login-container")}>
      <div className={`${styles["form-container"]}`}>
        <form id="loginForm" className={cx("form")} ref={loginFormRef}>
          <div className={cx("header")}>
            <div className={cx("active", isAdmin ? "admin" : "customer")}>
              {isAdmin ? "Admin" : "Customer"} Login
            </div>
            <div
              className={cx("inactive", isAdmin ? "customer" : "admin")}
              onClick={() => toggle((isAdmin: boolean) => !isAdmin)}
            >
              {isAdmin ? "Customer" : "Admin"}
            </div>
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="username" className={styles["input-label"]}>
              Username
            </label>
            <input
              className={styles["input-field"]}
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles["input-group"]}>
            <label htmlFor="password" className={styles["input-label"]}>
              Password
            </label>
            <input
              className={styles["input-field"]}
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>
        <div className={styles["action"]}>
          <Button
            className={isAdmin ? "amber-01" : "berry-01"}
            onClick={handleSubmit}
            form="loginForm"
          >
            Login
          </Button>
          {isLoading && <BouncingCircles height="2.5rem" width="5rem" />}
        </div>
        {errorMessage && (
          <div className={styles["error-message"]}>{errorMessage as string}</div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
