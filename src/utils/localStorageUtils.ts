function isValidJson(jsonString:string) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch  {
        return false;
    }
}

export function getUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) return null;
    const isJSON = isValidJson(storedUser);

    if (isJSON) return JSON.parse(storedUser);

    return null;
}
export function setUserToLocalStorage(user:string | object) {
    const userStringified = JSON.stringify(user);
    localStorage.setItem('user', userStringified);
}

export function getJwtFromLocalStorage() {
    return localStorage.getItem('jwtToken');
}
export function setJwtToLocalStorage(jwtToken:string) {
    return localStorage.setItem('jwtToken', jwtToken);
}
