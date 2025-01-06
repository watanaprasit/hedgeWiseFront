import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/authSlice';
import { AuthContainer, FormWrapper, Title, InputField, SubmitButton, ErrorText, SuccessText } from '../Auth.styles';
import { Link } from 'react-router-dom';  // Import Link to navigate to the Sign In page

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-firebase-user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      if (data.message) {
        setSuccess(true);
        dispatch(login(data.message)); // Automatically log in the user
      }
    } catch (err) {
      setError('Sign up failed. Please try again.');
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

        <Title>Sign Up</Title>
        {success && <SuccessText>Registration successful! You are now logged in.</SuccessText>}
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleSignUp}>
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
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </form>

        {/* Update the prompt text */}
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#5c6bc0', textDecoration: 'none' }}>
            Sign In
          </Link>.
        </p>
      </FormWrapper>
    </AuthContainer>
  );
};

export default SignUpForm;
