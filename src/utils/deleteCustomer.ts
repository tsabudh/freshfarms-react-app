import API_ROUTE from '../assets/globals/baseRoute.js';
export const deleteCustomer = (id:string, jwtToken:string) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute;
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    // let response = JSON.parse(xhttp.responseText);
                    resolve(null);
                }
            };

            apiRoute = `${API_ROUTE}/api/v1/customers/${id.toString()}`;
            xhttp.open('DELETE', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            xhttp.send();
        } catch (error:any) {
            console.log(error.message);
        }
    });
};

export default deleteCustomer;
