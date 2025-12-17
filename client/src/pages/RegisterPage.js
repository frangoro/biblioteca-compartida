/**
 * Página de registro de usuario
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUserApi } from '../services/authService';
import styles from './Login.module.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles['form-container']}>
            <form onSubmit={handleSubmit}>
                <h2>Crear una Cuenta</h2>
                {error && <p className={styles['error-message']}>{error}</p>}
                
                <div className={styles['form-group']}>
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={styles['form-group']}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles['form-group']}>
                    <label htmlFor="password">Contraseña</label>
                    <div className={styles['password-wrapper']}>
                        <input
                            type={showPassword ? 'text' : 'password'} 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            className={styles['toggle-password']}
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
                
                <div className={styles['form-link']}>
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;