import styled from 'styled-components';
import { theme } from '../styles/theme';
import { PageLayout } from './Layout/PageLayout';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xlarge};
  padding: ${theme.spacing.xlarge};
  max-width: 400px;
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
`;

const EmergencyCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xlarge};
  box-shadow: ${theme.shadows.card};
  border: 2px solid ${theme.colors.emergency};
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h1};
  color: ${theme.colors.emergency};
  margin-bottom: ${theme.spacing.large};
  text-align: center;
`;

const Instruction = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
  line-height: 1.5;
`;

const EmergencyNumber = styled.div`
  background: ${theme.colors.emergency};
  color: ${theme.colors.surface};
  font-size: ${theme.typography.fontSize.h1};
  font-weight: bold;
  text-align: center;
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius.medium};
  margin: ${theme.spacing.large} 0;
`;

const Button = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.surface};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.h3};
  font-weight: 600;
  cursor: pointer;
  margin-top: ${theme.spacing.large};
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export const EmergencyInstructionsScreen = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout progress={100}>
      <Container>
        <EmergencyCard>
          <Title>Emergency Instructions</Title>
          
          <Instruction>
            Based on your symptoms, you should seek immediate medical attention.
          </Instruction>
          
          <Instruction>
            Please call emergency services immediately:
          </Instruction>
          
          <EmergencyNumber>000</EmergencyNumber>
          
          <Instruction>
            While waiting for emergency services:
          </Instruction>
          
          <ul>
            <li>Stay calm and find a safe place to rest</li>
            <li>Have someone stay with you if possible</li>
            <li>Keep your phone nearby</li>
            <li>Unlock your door for emergency services</li>
          </ul>
        </EmergencyCard>
        
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Container>
    </PageLayout>
  );
}; 