import { useEffect } from "react";

export default function OAuthPopup() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const code_verifier = sessionStorage.getItem("pkce_verifier");

    if (!code || !code_verifier) {
      window.opener?.postMessage({ type: "oauth:error", error: "Missing code or verifier" }, "*");
      window.close();
      return;
    }

    fetch("http://localhost:4000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: "skd-app",
        redirect_uri: "http://localhost:5173/oauth-popup",
        code_verifier
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          window.opener?.postMessage({ type: "oauth:token", token: data.access_token }, "*");
        } else {
          window.opener?.postMessage({ type: "oauth:error", error: data.error }, "*");
        }
        window.close();
      });
  }, []);

  return <div>Authorizing…</div>;
}
