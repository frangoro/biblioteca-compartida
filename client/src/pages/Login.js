import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUserApi } from '../services/authService'; 

const Login = () => {
    const { login } = useAuth(); // 👈 Obtén la función de login
    // ... estados para email y password ...

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Llama a tu API. Asumimos que devuelve { user, token }
            const response = await loginUserApi({ email, password });
            
            // Llama a la función del contexto para actualizar el estado global
            login(response.user, response.token); 
            
            // Redirige al dashboard o a la home
            // ...
        } catch (error) {
            console.error('Error al iniciar sesión', error);
        }
    };
    
    // ... resto del formulario ...
};