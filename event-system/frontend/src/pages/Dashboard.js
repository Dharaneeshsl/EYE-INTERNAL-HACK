import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatsCard, SalesChart } from '../components/dashboard/DashboardWidgets';
import SatisfactionWidget from '../components/dashboard/SatisfactionWidget';
import ReferralWidget from '../components/dashboard/ReferralWidget';

const StatsGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 32px auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
  box-sizing: border-box;
  overflow-x: auto;
  margin-left: 240px;
  @media (max-width: 1200px) {
    margin-left: 0;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-left: 0;
  }
`;

const WidgetGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 32px auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  box-sizing: border-box;
  overflow-x: auto;
  margin-left: 240px;
  @media (max-width: 1200px) {
    margin-left: 0;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-left: 0;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: auto;
  margin-left: 240px;
  @media (max-width: 1200px) {
    margin-left: 0;
  }
`;

const Dashboard = () => {
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);
  return (
    <DashboardLayout>
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
      <WidgetGrid>
        <SatisfactionWidget />
        <ReferralWidget />
      </WidgetGrid>
      <ChartWrapper>
        <SalesChart />
      </ChartWrapper>
    </DashboardLayout>
  );
};

export default Dashboard;