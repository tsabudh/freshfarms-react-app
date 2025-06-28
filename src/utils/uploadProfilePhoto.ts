import API_ROUTE from '../assets/globals/baseRoute';

export async function uploadProfilePhoto(file: File, jwtToken: string) {
  if (!file) {
    throw new Error('No file provided');
  }

  const apiRoute = `${API_ROUTE}/api/v1/admins/uploadProfilePicture`;
  const formData = new FormData();
  formData.append('profilePhoto', file);

  const response = await fetch(apiRoute, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'File upload failed');
  }

  return data;
}

export default uploadProfilePhoto;
