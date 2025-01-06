import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #2e2e2e;  // Dark background for a professional, trading platform look
  font-family: 'Roboto', sans-serif;
`;

export const FormWrapper = styled.div`
  background: #1b1b1b;  // Dark gray background for the form container
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 24px;
  color: #fff;
  margin-bottom: 30px;
`;

export const ErrorText = styled.p`
  color: #f44336;
  margin-bottom: 15px;
`;

export const SuccessText = styled.p`
  color: #4caf50;  // Green color for success messages
  margin-bottom: 15px;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  background: #333;
  border: 1px solid #444;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #5c6bc0;
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #5c6bc0;  // Blue color for the button
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3f4d91;
  }

  &:focus {
    outline: none;
  }
`;

