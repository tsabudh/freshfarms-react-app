import API_ROUTE from '../assets/globals/baseRoute';
export const fetchProducts = (id, token) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute;
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };

            if (id) apiRoute = `${API_ROUTE}/api/v1/products/${id.toString()}`;
            else apiRoute = `${API_ROUTE}/api/v1/products/`;

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};
export default fetchProducts;
