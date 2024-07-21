import React, { createContext } from 'react';
export const AuthContext = createContext({
    jwtToken: localStorage.getItem('jwtToken'),
    user: {},
    setJwtToken: () => {},
    setUser: () => {},
    userRole: null,
    setUserRole: () => {},
});
