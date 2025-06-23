import API_ROUTE from '../assets/globals/baseRoute';
export async function uploadProfilePhoto(file:File, jwtToken:string) {
    return new Promise(async (resolve, reject) => {
        try {
            const apiRoute = `${API_ROUTE}/api/v1/admins/uploadProfilePicture`;

            const xhr = new XMLHttpRequest();

            if (file) {
                const formData = new FormData();
                formData.append('profilePhoto', file);

                const xhr = new XMLHttpRequest();
                xhr.open('POST', apiRoute, true);
                xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        //- Resolve promise if upload is successful
                        resolve(xhr.responseText);
                    } else {
                        //- Reject promise if error
                        console.error('Error uploading file:', xhr.statusText);
                        reject(xhr.statusText);
                    }
                };

                // Set any additional headers or configurations if needed
                // xhr.setRequestHeader('Authorization', 'Bearer yourAccessToken');

                // Send the FormData with the file
                xhr.send(formData);
            } else {
                console.error('No file selected');
            }
        } catch (error:any) {
            console.log(error);
        }
    });
}
export default uploadProfilePhoto;
