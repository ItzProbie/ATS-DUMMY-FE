import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const url = process.env.REACT_APP_BASE_URL;
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email and password are not empty
    if (!email || !password) {
      setErrorMessage('Please provide both email and password');
      return;
    }

    try {
      console.log(`${url}/auth/login`);
      const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the token is returned as data.token
        const { token } = data;
        if (token) {
          // Save the token in localStorage
          localStorage.setItem('authToken', token);
          alert('Login successful!');
        } else {
          setErrorMessage('Failed to get token');
        }
      } else {
        setErrorMessage('Invalid credentials or server error');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
