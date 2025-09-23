import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  height: 70px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.card};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

const SearchInput = styled.div`
  position: relative;
  width: 300px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 40px;
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  font-size: 14px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const UserRole = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <SearchInput>
        <SearchIcon>🔍</SearchIcon>
        <Input placeholder="Type here..." />
      </SearchInput>
      <UserSection>
        <IconButton>⚙️</IconButton>
        <IconButton>🔔</IconButton>
        <UserInfo>
          <UserName>ABOO DHARANEESH</UserName>
          <UserRole>Admin</UserRole>
        </UserInfo>
        <UserAvatar>MJ</UserAvatar>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;