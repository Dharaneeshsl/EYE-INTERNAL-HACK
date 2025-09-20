import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    border-radius: 50%;
    border: 10px solid ${({ theme }) => theme.colors.primary};
    border-top-color: ${({ theme }) => theme.colors.secondary};
    animation: ${rotate} 2s linear infinite;
  }
`;

const Percentage = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 1;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-size: 14px;
  text-align: center;
`;

const ProgressRing = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

const SatisfactionWidget = ({ satisfaction = 95, totalResponses = 1465 }) => {
  const size = 200;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (satisfaction / 100) * circumference;

  return (
    <Container>
      <Title>Satisfaction Rate</Title>
      <CircleContainer>
        <Circle>
          <Percentage>{satisfaction}%</Percentage>
        </Circle>
        <ProgressRing width={size} height={size}>
          <ProgressCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
          />
        </ProgressRing>
      </CircleContainer>
      <Description>{totalResponses} total responses</Description>
    </Container>
  );
};

export default SatisfactionWidget;