import baseRoute from "../assets/globals/baseRoute";
export const fetchProducts = (id,token) => {
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

            if (id)
                apiRoute = `${baseRoute}/api/v1/products/${id.toString()}`;
            else apiRoute = `${baseRoute}/api/v1/products/`;

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);

            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};
export default fetchProducts;