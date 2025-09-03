// C:\Users\hp\Downloads\annexure\frontend\src\components/Login.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

/**
 * @typedef {Object} FormState
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {string} message
 * @property {Object} [error]
 * @property {string} error.message
 * @property {string} error.code
 */

/**
 * Custom hook to manage form state and handlers.
 * @returns {{ formState: FormState, handleInputChange: Function, resetForm: Function }}
 */
const useForm = (initialState = { username: '', password: '' }) => {
  const [formState, setFormState] = useState(initialState);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => setFormState(initialState), [initialState]);

  return { formState, handleInputChange, resetForm };
};

/**
 * Custom hook to handle authentication API calls.
 * @returns {{ handleLogin: Function, handleRegister: Function, error: string }}
 */
const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleApiCall = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw data.error?.message || 'Request failed';
      return data;
    } catch (err) {
      setError(err.toString());
      return null;
    }
  };

  const handleLogin = useCallback(async (username, password) => {
    console.log('Login attempt - Username:', username, 'Password:', password);
    const data = await handleApiCall('http://localhost:5000/api/login', 'POST', { username, password });
    if (data?.token) {
      localStorage.setItem('token', data.token);
      navigate('/admin');
    }
  }, [navigate]);

  const handleRegister = useCallback(async (username, password) => {
    console.log('Registration attempt - Username:', username, 'Password:', password);
    const data = await handleApiCall('http://localhost:5000/api/register', 'POST', { username, password });
    if (data?.message) {
      setError('Registration successful. Please log in.');
      return true;
    }
    return false;
  }, []);

  return { handleLogin, handleRegister, error };
};

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { formState, handleInputChange, resetForm } = useForm();
  const { handleLogin, handleRegister, error } = useAuth();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { username, password } = formState;
      if (isRegistering) {
        const success = await handleRegister(username, password);
        if (success) resetForm();
      } else {
        await handleLogin(username, password);
      }
    },
    [isRegistering, handleLogin, handleRegister, formState, resetForm]
  );

  return (
    <div className="form-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formState.username}
            onChange={handleInputChange}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formState.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="apple-button primary">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="toggle-link">
        {isRegistering ? (
          <a href="#" onClick={() => { setIsRegistering(false); resetForm(); }}>
            Already have an account? Login
          </a>
        ) : (
          <a href="#" onClick={() => { setIsRegistering(true); resetForm(); }}>
            Need an account? Register
          </a>
        )}
      </p>
    </div>
  );
};

export default Login;