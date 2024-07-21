function isValidJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}

export function getUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    const isJSON = isValidJson(storedUser);

    if (isJSON) return JSON.parse(storedUser);

    return null;
}
export function setUserToLocalStorage(user) {
    let userStringified = JSON.stringify(user);
    localStorage.setItem('user', userStringified);
}

export function getJwtFromLocalStorage() {
    return localStorage.getItem('jwtToken');
}
export function setJwtToLocalStorage(jwtToken) {
    return localStorage.setItem('jwtToken', jwtToken);
}
