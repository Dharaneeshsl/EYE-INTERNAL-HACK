import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const Layout = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
  `;

  const MainContent = styled.main`
    flex: 1;
    margin-left: 240px;
    padding-top: 70px;
  `;

  return (
    <Layout>
      <Sidebar />
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </Layout>
  );
};

export default DashboardLayout;