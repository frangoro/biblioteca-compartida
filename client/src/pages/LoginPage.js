/**
 * Página de login
 */
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUserApi } from '../services/api';
import '../styles/Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Mensaje opcional que puede venir desde la página de registro
    const fromRegisterMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // La API debería devolver { user, token }
            const response = await loginUserApi({ email, password });
            login(response.user, response.token); // Guardamos el estado globalmente
            navigate('/'); // Redirigimos a la página principal o al dashboard
        } catch (err) {
            setError(err.message || 'Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                {fromRegisterMessage && <p className="success-message">{fromRegisterMessage}</p>}
                {error && <p className="error-message">{error}</p>}

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
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
                <div className="form-link">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;