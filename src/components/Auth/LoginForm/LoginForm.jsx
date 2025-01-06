import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/authSlice';
import { AuthContainer, FormWrapper, Title, ErrorText, InputField, SubmitButton } from '../Auth.styles';
import { Link } from 'react-router-dom';  

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-firebase-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const data = await response.json();
      if (data.status === 'success') {
        dispatch(login(data.user_id));
        localStorage.setItem('userEmail', email);
        window.location.href = '/dashboard';  // Example redirection
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <AuthContainer>
      <FormWrapper>
        <img 
          src="/HedgeWiseLogo.png" 
          alt="HedgeWise Logo" 
          style={{ width: '150px', height: 'auto', marginBottom: '20px' }} 
        />

        
        <Title>Login</Title>
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleLogin}>
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit">Login</SubmitButton>
        </form>

        {/* Update the prompt text */}
        <p>
          Do not have an account?{' '}
          <Link to="/signup" style={{ color: '#5c6bc0', textDecoration: 'none' }}>
            Sign Up
          </Link>.
        </p>
      </FormWrapper>
    </AuthContainer>
  );
};

export default LoginForm;
