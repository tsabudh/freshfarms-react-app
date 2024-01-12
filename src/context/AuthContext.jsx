import React, { createContext } from 'react';
export const AuthContext = createContext({
    token: localStorage.getItem('token'),
    setToken: () => {},
});
