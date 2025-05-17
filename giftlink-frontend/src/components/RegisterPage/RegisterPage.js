import React, { useState } from 'react';
import './RegisterPage.css';
import { urlConfig } from '../../config'; // Task 1
import { useAppContext } from '../../context/AuthContext'; // Task 2
import { useNavigate } from 'react-router-dom'; // Task 3

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Task 4
    const navigate = useNavigate(); // Task 5
    const { setIsLoggedIn } = useAppContext(); // Task 5

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6
                headers: {
                    'Content-Type': 'application/json' // Task 7
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                }) // Task 8
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('auth-token', data.token);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setErrorMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred while registering');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        <div className="form-group mb-3">
                            <label>First Name</label>
                            <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Last Name</label>
                            <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {errorMessage && (
                        <div className="alert alert-danger mt-2">{errorMessage}</div>
                        )}

                        <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>

                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
