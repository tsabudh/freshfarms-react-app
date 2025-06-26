import React, { createContext } from 'react';
import type {AuthContextInterface} from 'types/authContext.interface';

export const AuthContext = createContext<AuthContextInterface>({
    jwtToken: localStorage.getItem('jwtToken'),
    user: null,
    setJwtToken: () => {},
    setUser: () => {},
    userRole: null,
    setUserRole: () => {},
});
