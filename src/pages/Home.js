import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };
  const goToSignup = () => {
    navigate('/signup');
  };
  const goToUpload = () => {
    navigate('/upload');
  };

  return (
    <div>
      <h2>Home</h2>
      <button onClick={goToLogin}>Go to Login</button>
      <button onClick={goToSignup}>Go to Signup</button>
      <button onClick={goToUpload}>Go to Upload</button>
    </div>
  );
};

export default Home;
