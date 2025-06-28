import API_ROUTE from "../assets/globals/baseRoute";

export const fetchProducts = async (id?: string, jwtToken?: string) => {
  const apiRoute = id
    ? `${API_ROUTE}/api/v1/products/${id.toString()}`
    : `${API_ROUTE}/api/v1/products/`;

  let headers;

  if (jwtToken) {
    headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
  }

  const fetchOptions = {
    method: "GET",
    headers,
  };

  const response = await fetch(apiRoute, fetchOptions);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export default fetchProducts;
