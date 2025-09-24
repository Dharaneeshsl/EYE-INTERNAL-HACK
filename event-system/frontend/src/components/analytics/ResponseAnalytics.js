import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-left: 240px;
  @media (max-width: 900px) {
    margin-left: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Subtitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ResponseAnalytics = () => {
  // Sample data - replace with real data
  const responseData = [
    { date: '2023-09-01', responses: 45 },
    { date: '2023-09-02', responses: 52 },
    { date: '2023-09-03', responses: 48 },
    { date: '2023-09-04', responses: 70 },
    { date: '2023-09-05', responses: 61 },
    { date: '2023-09-06', responses: 85 },
    { date: '2023-09-07', responses: 93 },
  ];

  const satisfactionData = [
    { name: 'Very Satisfied', value: 45 },
    { name: 'Satisfied', value: 30 },
    { name: 'Neutral', value: 15 },
    { name: 'Dissatisfied', value: 7 },
    { name: 'Very Dissatisfied', value: 3 },
  ];

  return (
    <Container>
      <Grid>
        <Card>
          <Title>Total Responses</Title>
          <StatValue>358</StatValue>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseData}>
                <defs>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#b0bec5" />
                <YAxis stroke="#b0bec5" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="responses"
                  stroke="#2196f3"
                  fillOpacity={1}
                  fill="url(#colorResponses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card>
          <Title>Satisfaction Distribution</Title>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#b0bec5" />
                <YAxis stroke="#b0bec5" />
                <Tooltip />
                <Bar dataKey="value" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </Grid>

      <Card>
        <Title>Recent Responses</Title>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Respondent</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Certificate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid #333' }}>2023-09-07</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #333' }}>John Doe</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #333' }}>Complete</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #333' }}>Sent</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  );
};

export default ResponseAnalytics;