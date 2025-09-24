import React from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SatisfactionWidget from './SatisfactionWidget';
import ReferralWidget from './ReferralWidget';

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatTrend = styled.span`
  color: ${({ $isPositive }) => ($isPositive ? '#00c853' : '#d50000')};
  font-size: 14px;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ActiveUsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ActiveUserCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`;

const data = [
  { name: 'Jan', sales: 200, users: 150 },
  { name: 'Feb', sales: 300, users: 250 },
  { name: 'Mar', sales: 200, users: 180 },
  { name: 'Apr', sales: 278, users: 220 },
  { name: 'May', sales: 189, users: 170 },
  { name: 'Jun', sales: 239, users: 200 },
  { name: 'Jul', sales: 349, users: 300 },
  { name: 'Aug', sales: 430, users: 380 },
  { name: 'Sep', sales: 401, users: 350 },
  { name: 'Oct', sales: 300, users: 280 },
  { name: 'Nov', sales: 450, users: 400 },
  { name: 'Dec', sales: 380, users: 340 },
];

export const StatsCard = ({ title, value, trend, isPositive }) => (
  <StatCard>
    <StatLabel>{title}</StatLabel>
    <StatValue>{value}</StatValue>
    <StatTrend $isPositive={isPositive}>
      {isPositive ? '↑' : '↓'} {trend}
    </StatTrend>
  </StatCard>
);

export const SalesChart = () => (
  <StatCard>
    <StatLabel>Sales Overview</StatLabel>
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#132F4C" />
          <XAxis dataKey="name" stroke="#b0bec5" />
          <YAxis stroke="#b0bec5" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#132F4C',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#2196f3"
            fillOpacity={1}
            fill="url(#colorSales)"
            name="Sales"
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#00e5ff"
            fillOpacity={1}
            fill="url(#colorUsers)"
            name="Users"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
    <ActiveUsersGrid>
      <ActiveUserCard>
        <StatValue>32,984</StatValue>
        <StatLabel>Users</StatLabel>
      </ActiveUserCard>
      <ActiveUserCard>
        <StatValue>2.42m</StatValue>
        <StatLabel>Clicks</StatLabel>
      </ActiveUserCard>
      <ActiveUserCard>
        <StatValue>2,400$</StatValue>
        <StatLabel>Sales</StatLabel>
      </ActiveUserCard>
      <ActiveUserCard>
        <StatValue>320</StatValue>
        <StatLabel>Items</StatLabel>
      </ActiveUserCard>
    </ActiveUsersGrid>
  </StatCard>
);