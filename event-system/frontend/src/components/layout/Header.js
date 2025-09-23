import React from 'react';
import styled from 'styled-components';
import { Menu, Search, Settings, Notifications } from '@mui/icons-material';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: ${({ isOpen }) => (isOpen ? '240px' : '0')};
  height: 70px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  z-index: 100;
  transition: left 0.3s ease-in-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    left: 0;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.cardBg};
  }
`;

const MenuButton = styled(IconButton)`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  width: 320px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  margin-left: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
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

const Header = ({ isOpen, setOpen }) => {
  return (
    <HeaderContainer isOpen={isOpen}>
      <LeftSection>
        <MenuButton onClick={() => setOpen(!isOpen)}>
          <Menu />
        </MenuButton>
        <SearchInput>
          <Search style={{ color: '#b0bec5' }} />
          <Input placeholder="Search..." />
        </SearchInput>
      </LeftSection>

      <UserSection>
        <IconButton>
          <Settings />
        </IconButton>
        <IconButton>
          <Notifications />
        </IconButton>
        <UserAvatar>MJ</UserAvatar>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
