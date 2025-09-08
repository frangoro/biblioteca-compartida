/**
 * Contexto y hook para la autenticación de usuarios
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { setLogoutCallback } from '../services/axiosInstance';

// Este es el contexto que creamos para la autenticación
const AuthContext = createContext(null);

// Este es el proveedor del contexto que envolverá nuestra aplicación
// Proporciona el estado de autenticación y las funciones para iniciar y cerrar sesión
// al resto de componentes de la aplicación.
// También maneja la carga inicial de datos desde localStorage.
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Función para cerrar sesión
    const logout = () => {
        setUserInfo(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    // Efecto para cargar los datos desde localStorage al iniciar la app
    // Cada vez que se abre una nueva pestaña, se vuevle a ejecutar y 
    // se renderiza todo el árbol de componentes. Por tanto hay que volver a 
    // sacar el usuario del localStorage y verificar si el token es válido.
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                const decodedToken = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000; // Tiempo actual en segundos
                
                // Verifica si el token ha caducado
                if (decodedToken.exp < currentTime) {
                    logout();
                } else {
                    // Si el token aún es válido, cargamos la información del usuario
                    setUserInfo(decodedToken);
                }

                setToken(storedToken);
                
            }
        } catch (error) {
            console.error("Error al cargar la autenticación desde localStorage", error);
            logout();
        } finally {
            setLoading(false); // Terminamos la carga inicial
        }
        setLogoutCallback(logout);
    }, []);

    // Función para iniciar sesión
    const login = (userData, userToken) => {
        setUserInfo(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
    };

    // El valor que proveeremos a los componentes hijos
    const value = {
        userInfo,
        token,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {/* No renderizamos nada hasta que la carga inicial desde localStorage termine */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
    return useContext(AuthContext);
};