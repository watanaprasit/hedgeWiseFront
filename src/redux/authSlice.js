import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authToken: localStorage.getItem('authToken') || '',
  userEmail: localStorage.getItem('userEmail') || '', // Store email if needed
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.authToken = action.payload.authToken;
      state.userEmail = action.payload.userEmail; // If you're storing email
      localStorage.setItem('authToken', action.payload.authToken);
      localStorage.setItem('userEmail', action.payload.userEmail); // If you're storing email
    },
    logout: (state) => {
      state.authToken = '';
      state.userEmail = ''; // Clear the user email from state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail'); // Remove the email from localStorage as well
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
