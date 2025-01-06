import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { HeaderWrapper, Title, LogoutButton, TimezoneDisplay } from './Header.styles';

const Header = ({ userEmail }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hagueTime, setHagueTime] = useState('');
  const [tokyoTime, setTokyoTime] = useState('');
  const [dubaiTime, setDubaiTime] = useState('');
  const [houstonTime, setHoustonTime] = useState('');  // Add state for Houston time

  // Update timezone function
  const updateTimezones = () => {
    const options = { hour: '2-digit', minute: '2-digit' };
    setHagueTime(new Date().toLocaleTimeString('en-GB', { ...options, timeZone: 'Europe/Amsterdam' }));
    setTokyoTime(new Date().toLocaleTimeString('en-GB', { ...options, timeZone: 'Asia/Tokyo' }));
    setDubaiTime(new Date().toLocaleTimeString('en-GB', { ...options, timeZone: 'Asia/Dubai' }));
    setHoustonTime(new Date().toLocaleTimeString('en-GB', { ...options, timeZone: 'America/Chicago' }));  // Houston time
  };

  // Auto-update timezones every minute
  useEffect(() => {
    updateTimezones();
    const interval = setInterval(updateTimezones, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <HeaderWrapper>
      <Title>Welcome, {userEmail || 'Guest'}</Title>
      <TimezoneDisplay>
        <strong>The Hague</strong>: {hagueTime} | <strong>Tokyo</strong>: {tokyoTime} | <strong>Dubai</strong>: {dubaiTime} | <strong>Houston</strong>: {houstonTime} {/* Display Houston time */}
      </TimezoneDisplay>
      <nav>
        <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
      </nav>
    </HeaderWrapper>
  );
};

export default Header;
