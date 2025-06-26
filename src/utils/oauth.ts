export async function redirectToAuth() {
  const code_verifier = crypto.randomUUID(); // or generate a strong random string
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );
  const code_challenge = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  sessionStorage.setItem("pkce_verifier", code_verifier);

  const authUrl = `http://localhost:4000/authorize?response_type=code&client_id=skd-app&redirect_uri=http://localhost:5173/callback&code_challenge=${code_challenge}&code_challenge_method=S256`;

  window.location.href = authUrl;
}

export async function openOAuthPopup() {

 const array = new Uint8Array(64);
  crypto.getRandomValues(array);

  // Convert to base64url string, length will be >43 chars
  const code_verifier = btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // SHA256 hash the code_verifier to get code_challenge
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );

  const code_challenge = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  sessionStorage.setItem("pkce_verifier", code_verifier);

  const redirectUri = encodeURIComponent("http://localhost:5173/oauth-popup");
  const url = `http://localhost:4000/authorize?response_type=code&client_id=skd-app&redirect_uri=${redirectUri}&code_challenge=${code_challenge}&code_challenge_method=S256&state=xyz123`;

  const popup = window.open(
    url,
    "OAuthPopup",
    "width=500,height=600"
  );

  return new Promise((resolve, reject) => {
    const listener = (event:MessageEvent) => {
      if (event.origin !== "http://localhost:5173") return;
      if (event.data.type === "oauth:token") {
        window.removeEventListener("message", listener);
        resolve(event.data.token);
      } else if (event.data.type === "oauth:error") {
        reject(event.data.error);
      }
    };

    window.addEventListener("message", listener);
  });
}
