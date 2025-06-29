import API_ROUTE from "../assets/globals/baseRoute";
export const fetchCustomers = async (
  id: string | null,
  jwtToken: string,
  userRole: "customer" | "admin" | string,
) => {
  try {
    let apiRoute;

    if (userRole && userRole === "customer") {
      apiRoute = `${API_ROUTE}/api/v1/customers/getMyDetails`;
    } else if (id) {
      apiRoute = `${API_ROUTE}/api/v1/customers/one/${id.toString()}`;
    } else {
      apiRoute = `${API_ROUTE}/api/v1/customers/all`;
    }

    const response = await fetch(apiRoute, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      throw new Error("An unexpected error occurred");
    }

    return null;
  }
};

export default fetchCustomers;
