import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { HeaderWrapper, Title, LogoutButton } from './Header.styles';

const Header = ({ userEmail }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state
    dispatch(logout());

    // Clear localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <HeaderWrapper>
      <Title>Welcome, {userEmail || 'Guest'}</Title>
      <nav>
        <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
      </nav>
    </HeaderWrapper>
  );
};

export default Header;
