import API_ROUTE from "../assets/globals/baseRoute";

export async function refreshToken(
  jwtToken: string,
) {
  const apiRoute = `${API_ROUTE}/api/v1/common/refreshToken`;

  const response = await fetch(apiRoute, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`${(await response.json()).message}`);
  }

  const data = await response.json();

  if(!data) throw new Error("Fatal: could not extract data from response.")
  return data;
}

export default refreshToken;
