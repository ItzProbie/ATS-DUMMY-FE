import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Validate email and send OTP
  const validateEmail = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://stunning-sniffle-r4p6pj46vp4h57p4-4000.app.github.dev/api/v1/auth/sendOtp', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setError('');
      } else {
        setError('Failed to send OTP');
      }
    } catch (err) {
        console.log(err.data);
      setError('Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://stunning-sniffle-r4p6pj46vp4h57p4-4000.app.github.dev/api/v1/auth/signup', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          otp,
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/login');
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setError('Error during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={!otpSent}
            required
          />
        </div>
        <div>
          <button
            type="button"
            onClick={validateEmail}
            disabled={loading}
          >
            Validate Email
          </button>
        </div>
        {otpSent && (
          <div>
            <button type="submit" disabled={loading}>
              Sign Up
            </button>
          </div>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
