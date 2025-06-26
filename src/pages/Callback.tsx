import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const code_verifier = sessionStorage.getItem("pkce_verifier");

    if (!code || !code_verifier) {
      console.error("Missing code or code_verifier");
      return;
    }

    // Exchange the code for a token
    fetch("http://localhost:4000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: "skd-app",
        redirect_uri: "http://localhost:5173/callback",
        code_verifier
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          // Save token and navigate
          localStorage.setItem("access_token", data.access_token);
          navigate("/dashboard");
        } else {
          console.error("Token exchange failed", data);
        }
      });
  }, [navigate]);

  return <div>Authorizing...</div>;
};

export default Callback;
