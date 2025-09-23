import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${({ isOpen }) => (isOpen ? '240px' : '0')};
  padding-top: 70px;
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const DashboardLayout = ({ children }) => {
  const [isOpen, setOpen] = useState(true);

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout>
      <Sidebar isOpen={isOpen} setOpen={setOpen} />
      <Header isOpen={isOpen} setOpen={setOpen} />
      <MainContent isOpen={isOpen}>
        {children}
      </MainContent>
    </Layout>
  );
};

export default DashboardLayout;
