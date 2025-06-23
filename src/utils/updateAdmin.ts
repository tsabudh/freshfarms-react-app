import { UserProfile } from 'types/user.interface';
import API_ROUTE from '../assets/globals/baseRoute';
export const updateAdmin = (id:string, adminDetails:UserProfile, jwtToken:string) => {
    return new Promise((resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            const apiRoute = `${API_ROUTE}/api/v1/admins/updateMe`;

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    let response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
            };
            xhttp.open('PATCH', apiRoute);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

            let requestBody = JSON.stringify(adminDetails);
            xhttp.send(requestBody);
        } catch (error:any) {
            console.log(error);
            reject(error);
        }
    });
};

export default updateAdmin;
