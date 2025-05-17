import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Task 5
    const { setIsLoggedIn } = useAppContext(); // Task 5
    const [errorMessage, setErrorMessage] = useState('');

    const bearerToken = sessionStorage.getItem('auth-token'); // Task 5

    // Task 6: If already logged in, go to /app
    if (bearerToken) {
    navigate('/app');
    }

    const handleLogin = async () => {
    try {
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST', // Task 7
        headers: {
            'Content-Type': 'application/json' // Task 8
        },
        body: JSON.stringify({
            email,
            password
        }) // Task 9
    });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('auth-token', data.authtoken); // Task 10
            sessionStorage.setItem('user-name', data.userName);   // Task 11
            sessionStorage.setItem('user-email', data.userEmail); // Task 11
            setIsLoggedIn(true);                                  // Task 12
            navigate('/app');                                     // Task 13
        } else {
            setErrorMessage(data.message || 'Login failed');      // Task 14
        }
    } catch (error) {
        setErrorMessage('An error occurred while logging in');  // Task 15
    }
};

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>

                        {errorMessage && (
                            <div className="alert alert-danger mt-2">{errorMessage}</div>
                        )}

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
