import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { StatsCard, SalesChart } from '../components/dashboard/DashboardWidgets';
import SatisfactionWidget from '../components/dashboard/SatisfactionWidget';
import ReferralWidget from '../components/dashboard/ReferralWidget';

const DashboardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const MainContent = styled.div`
  margin-left: 240px;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Sidebar />
      <Header />
      <MainContent>
        <StatsGrid>
          <StatsCard
            title="Today's Money"
            value="$53,000"
            trend="+55%"
            isPositive={true}
          />
          <StatsCard
            title="Today's Users"
            value="2,300"
            trend="+5%"
            isPositive={true}
          />
          <StatsCard
            title="New Clients"
            value="+3,052"
            trend="-14%"
            isPositive={false}
          />
          <StatsCard
            title="Total Sales"
            value="$173,000"
            trend="+8%"
            isPositive={true}
          />
        </StatsGrid>
        
        <StatsGrid>
          <SatisfactionWidget />
          <ReferralWidget />
        </StatsGrid>
        
        <SalesChart />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
