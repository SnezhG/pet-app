import React, { createContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken } from './auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await getToken();
            setIsAuthenticated(!!token);
            setLoading(false);
        };
        checkAuthStatus();
    }, []);

    const login = async (token) => {
        await saveToken(token);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await removeToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
