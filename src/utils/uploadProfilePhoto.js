import baseRoute from '../assets/globals/baseRoute';
export async function uploadProfilePhoto(file, token) {
    return new Promise(async (resolve, reject) => {
        try {
            const apiRoute = `${baseRoute}/api/v1/admins/uploadProfilePicture`;

            const xhr = new XMLHttpRequest();

            if (file) {
                const formData = new FormData();
                formData.append('profilePhoto', file);

                const xhr = new XMLHttpRequest();
                xhr.open('POST', apiRoute, true);
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);

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
        } catch (error) {
            console.log(error);
        }
    });
}
export default uploadProfilePhoto;
