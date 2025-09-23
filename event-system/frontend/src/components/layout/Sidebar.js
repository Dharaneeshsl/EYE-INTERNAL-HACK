import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard, 
  ListAlt, 
  Assessment, 
  CardMembership, 
  Settings 
} from '@mui/icons-material';

const SidebarContainer = styled.div`
  width: 240px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ $isActive }) => 
    $isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing.md};
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/forms/builder', label: 'Form Builder', icon: <ListAlt /> },
    { path: '/analytics', label: 'Analytics', icon: <Assessment /> },
    { path: '/certificates', label: 'Certificates', icon: <CardMembership /> },
    { path: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <SidebarContainer>
      <Logo>Event System</Logo>
      {menuItems.map((item) => (
        <MenuItem
          key={item.path}
          $isActive={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          {item.icon} {item.label}
        </MenuItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;