export const fetchProducts = (id) => {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            let apiRoute;
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response.data);
                }
            };

            if (id)
                apiRoute = `http://127.0.0.1:3000/api/v1/products/${id.toString()}`;
            else apiRoute = 'http://127.0.0.1:3000/api/v1/products/';

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6IjY0NjlhM2IxMzkwM2EwZmE1ZjUyMjMzYiIsImlzc3VlZEF0IjoxNjg0NjczMzAwMTk2LCJpYXQiOjE2ODQ2NzMzMDB9.26JLp_lg3UB862q3MUNgYIxIGyMwZtXW3uDhlyaTEBs'
            );
            xhttp.send();
        } catch (error) {
            console.log(error.message);
        }
    });
};
export default fetchProducts;