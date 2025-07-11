/**
 * Contexto y hook para la autenticación de usuarios
 */
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext(null);

// 2. Creamos el componente Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Efecto para cargar los datos desde localStorage al iniciar la app
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUserInfo = localStorage.getItem('userInfo');

            if (storedToken && storedUserInfo) {
                setToken(storedToken);
                setUserInfo(JSON.parse(storedUserInfo));
            }
        } catch (error) {
            console.error("Error al cargar la autenticación desde localStorage", error);
        } finally {
            setLoading(false); // Terminamos la carga inicial
        }
    }, []);

    // Función para iniciar sesión
    const login = (userData, userToken) => {
        setUserInfo(userData);
        setToken(userToken);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    };

    // Función para cerrar sesión
    const logout = () => {
        setUserInfo(null);
        setToken(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    // El valor que proveeremos a los componentes hijos
    const value = {
        userInfo,
        token,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* No renderizamos nada hasta que la carga inicial desde localStorage termine */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Creamos el Hook personalizado para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};