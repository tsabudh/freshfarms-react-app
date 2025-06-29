import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./OverlayContainer.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../utils/loginUser";
import BouncingCircles from "../UI/Vectors/BouncingCircles";

function OverlayContainer({
  isNewUser,
  toggle,
}: {
  isNewUser: boolean;
  toggle: (isNewUser: boolean) => void;
}) {
  const { setJwtToken, userRole } = useContext(AuthContext);
  const [, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function dummyLogin() {
    if (!(userRole === "customer" || userRole === "admin")) return;
    setErrorMessage(null);
    setIsLoading(true);
    const loginDetails = {
      username: "john",
      password: "1234",
    };
    const stringifiedDetails = JSON.stringify(loginDetails);
    const response = await loginUser(stringifiedDetails, userRole);
    setIsLoading(false);
    if (response.status == "success" && response.token) {
      setJwtToken(response.token);
      localStorage.setItem("jwtToken", response.token);
      navigate("/dashboard");
    } else if (response.status == "failure") {
      // setErrorMessage(response.message);
      toast(response.message, { toastId: "overlayToast" });
    } else setErrorMessage("Something went terribly wrong!");
  }

  return (
    <div
      className={`${styles["overlay"]} ${
        isNewUser ? styles["overlay--left"] : styles["overlay--right"]
      }`}
    >
      <div className={styles["headings"]}>
        <h1>Freshfarms</h1>
        <h3>Admin Dashboard</h3>
      </div>
      {isNewUser ? (
        <p>
          If you are a registered user,
          <span
            onClick={() => toggle(!isNewUser)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggle(!isNewUser);
              }
            }}
          >
            Log in
          </span>
          instead.
        </p>
      ) : (
        <p>
          If this is your first time,
          <span
            onClick={() => toggle(!isNewUser)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggle(!isNewUser);
              }
            }}
          >
            Sign up
          </span>
          instead.
        </p>
      )}

      <div className={styles["dummy"]}>
        <p>Too much hassle?</p>

        <div className={styles["highlighted"]} onClick={dummyLogin} role="button" tabIndex={0} onKeyDown={(e)=>{
            if(e.key === "Enter" || e.key === " "){
                dummyLogin();
            }
        }}>
          <div className={styles["rainbow"]}></div>
          <span>Log in with a dummy account instead.</span>
        </div>

        <div className={styles["placeholder-loader"]}>
          {isLoading && <BouncingCircles height="1em" />}
        </div>
      </div>
    </div>
  );
}
export default OverlayContainer;
