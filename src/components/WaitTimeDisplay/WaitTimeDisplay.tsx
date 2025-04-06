import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background: white;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid rgba(203, 213, 225, 0.4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 480px;
  width: 100%;
`;

const WaitTimeInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const WaitTimeRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const WaitTimeLabel = styled.div`
  color: ${theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: ${theme.colors.primary};
  }
`;

const WaitTimeValue = styled.span`
  color: ${theme.colors.primary};
  font-size: 18px;
  font-weight: 600;
`;

const ComparisonText = styled.div`
  font-size: 13px;
  color: ${theme.colors.text.secondary};
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  strong {
    color: ${theme.colors.text.primary};
  }
`;

const StatusIndicator = styled.div<{ waitTime: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${props => {
    if (props.waitTime < 20) return '#10b981';
    if (props.waitTime < 40) return '#3b82f6';
    return '#3b82f6';
  }};
`;

interface WaitTimeDisplayProps {
  currentWaitTime: number;
}

export const WaitTimeDisplay = ({ currentWaitTime }: WaitTimeDisplayProps) => {
  // Calculate the comparison with ER wait times (typically 3-4+ hours)
  const getERComparison = (minutes: number) => {
    const erWaitHours = 4; // Average ER wait in hours
    const timeSaved = erWaitHours - (minutes / 60);
    return Math.max(timeSaved, 1).toFixed(1); // Ensure at least 1 hour saved
  };

  return (
    <Container>
      <StatusIndicator waitTime={currentWaitTime} />
      <WaitTimeInfo>
        <WaitTimeRow>
          <WaitTimeLabel>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Wait time:
          </WaitTimeLabel>
          <WaitTimeValue>{currentWaitTime} minutes</WaitTimeValue>
        </WaitTimeRow>
        <ComparisonText>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <strong>{getERComparison(currentWaitTime)}+ hours faster</strong> than typical emergency departments
        </ComparisonText>
      </WaitTimeInfo>
    </Container>
  );
}; 