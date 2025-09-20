import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const CircleContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    ${({ theme, score }) => theme.colors.secondary} ${score * 10}%,
    ${({ theme }) => theme.colors.background} ${score * 10}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.cardBg};
  }
`;

const Score = styled.div`
  position: relative;
  z-index: 1;
  font-size: 48px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ScoreLabel = styled.div`
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 4px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 500;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const ReferralWidget = ({ score = 7.9, totalReferrals = 145, activeUsers = 'Safety' }) => {
  return (
    <Container>
      <Title>Referral Tracking</Title>
      <CircleContainer>
        <Circle score={score}>
          <div>
            <Score>{score}</Score>
            <ScoreLabel>Total Score</ScoreLabel>
          </div>
        </Circle>
      </CircleContainer>
      <Stats>
        <StatItem>
          <StatValue>{totalReferrals}</StatValue>
          <StatLabel>people</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{activeUsers}</StatValue>
          <StatLabel>Bonus</StatLabel>
        </StatItem>
      </Stats>
    </Container>
  );
};

export default ReferralWidget;