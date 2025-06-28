import API_ROUTE from '../assets/globals/baseRoute';
export const fetchMessages = (jwtToken:string) => {
    return new Promise((resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    const response = JSON.parse(xhttp.responseText);
                    if (response.status == 'success') {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                }
            };

            const apiRoute = `${API_ROUTE}/api/v1/messages/getMyMessages`;

            xhttp.open('GET', apiRoute);
            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            xhttp.send();
        } catch (error:unknown) {
    // Handle errors
        if (error instanceof Error) {   
            console.error(error.message);
        }
        else {
            throw new Error('An unexpected error occurred');
        }
        return null;
    }
    });
};

export default fetchMessages;
