import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const AuthCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ToggleText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
    cursor: pointer;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
        <ToggleText>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Register</span>
        </ToggleText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;