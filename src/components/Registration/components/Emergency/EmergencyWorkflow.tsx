import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../../styles/theme';
import { LoginForm } from './LoginForm';
import { Logo } from '../../../InitialChoiceScreen/Logo';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  padding: ${theme.spacing.xlarge} 0;
  animation: ${fadeIn} 0.6s ease-out;
`;


interface EmergencyWorkflowProps {
  onExistingUser: () => void;
  onNewUser: () => void;
}

export const EmergencyWorkflow: React.FC<EmergencyWorkflowProps> = ({
  onExistingUser,
  onNewUser
}) => {
  return (
    <ContentContainer>
      <Logo />
      
      <LoginForm 
        onExistingUser={onExistingUser}
        onNewUser={onNewUser}
      />
    </ContentContainer>
  );
}; 