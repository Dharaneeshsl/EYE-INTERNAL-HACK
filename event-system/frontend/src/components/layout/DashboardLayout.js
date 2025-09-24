import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.div`
  display: block;
`;

const SidebarWrapper = styled.div`
  width: 240px;
  flex-shrink: 0;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 32px 24px 24px 24px;
  margin-left: 0;
  margin-top: 30px;
`;

const DashboardLayout = ({ children }) => {
  return (
    <Layout>
      <Header />
      <ContentWrapper>
        <Sidebar />
        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
    </Layout>
  );
};

export default DashboardLayout;
