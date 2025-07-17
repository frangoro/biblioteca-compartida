/**
 * Página de registro de usuario
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUserApi } from '../services/authService';
import '../styles/Login.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await registerUserApi({ username, email, password });
            // Si el registro es exitoso, redirigimos al usuario a la página de login
            navigate('/login', { state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' } });
        } catch (err) {
            setError(err.message || 'Error al registrar el usuario. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Crear una Cuenta</h2>
                
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
                <div className="form-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;