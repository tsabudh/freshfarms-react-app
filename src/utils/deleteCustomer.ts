import API_ROUTE from "../assets/globals/baseRoute";
export const deleteCustomer = (id: string, jwtToken: string) => {
  return new Promise((resolve, reject) => {
    try {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
          // let response = JSON.parse(xhttp.responseText);
          resolve(null);
        }
      };

      const apiRoute = `${API_ROUTE}/api/v1/customers/${id.toString()}`;
      xhttp.open("DELETE", apiRoute);
      xhttp.setRequestHeader("Authorization", `Bearer ${jwtToken}`);

      xhttp.send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        reject(error);
      } else {
        reject(new Error("An unknown error occurred"));
      }
    }
  });
};

export default deleteCustomer;
