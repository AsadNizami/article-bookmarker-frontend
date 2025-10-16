import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ type, baseUrl, onAuthSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isLogin = type === 'login';
    const formTitle = isLogin ? 'Log In' : 'Register';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? `${baseUrl}/token` : `${baseUrl}/users/`;

        try {
            let response;

            if (isLogin) {
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);

                response = await axios.post(
                    endpoint,
                    formData,
                );
                
                onAuthSuccess(response.data.access_token);
                
            } else {
                response = await axios.post(
                    endpoint,
                    { username, password },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                alert(`User ${response.data.username} successfully registered! Please log in.`);
                
                setUsername('');
                setPassword('');
                
            }

        } catch (err) {
            console.error(`${formTitle} error:`, err);
            
            if (err.response) {
                const apiError = err.response.data.detail;
                
                if (err.response.status === 401 && isLogin) {
                    setError('Incorrect username or password.');
                } else if (err.response.status === 400 && !isLogin && typeof apiError === 'string') {
                    setError(apiError); // e.g., "Username already registered"
                } else {
                    setError('An API error occurred.');
                }
            } else {
                setError('Could not connect to the server. Check backend URL and CORS setup.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p style={{ color: 'red' }}>{error}</p>
            <div>
                <label htmlFor={`${type}-username`}>Username:</label>
                <input
                    id={`${type}-username`}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div>
                <label htmlFor={`${type}-password`}>Password:</label>
                <input
                    id={`${type}-password`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? `${formTitle}...` : formTitle}
            </button>
        </form>
    );
}

export default AuthForm;