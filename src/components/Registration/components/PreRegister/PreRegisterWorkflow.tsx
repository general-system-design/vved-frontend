import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../../styles/theme';
import { MedicareNotice } from '../../ConversationalRegistration.styles';
import {
  HeaderSection,
  Title,
  ButtonContainer,
  Button
} from '../../screens/RegistrationChoice/styles';

const PreRegisterNotice = styled(MedicareNotice)`
  margin-top: 0;
  padding: ${theme.spacing.xlarge};
  background: white;
  border: 1px solid ${theme.colors.text.disabled};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const NoticeTitle = styled.h2`
  font-size: ${theme.typography.fontSize.h3};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.medium};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};

  svg {
    color: ${theme.colors.primary};
    width: 24px;
    height: 24px;
  }
`;

const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${theme.spacing.large};

  li {
    position: relative;
    padding-left: ${theme.spacing.large};
    margin-bottom: ${theme.spacing.medium};
    color: ${theme.colors.text.secondary};
    line-height: 1.6;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${theme.colors.primary};
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const EmergencySwitch = styled.button`
  width: 100%;
  height: 48px;
  background: ${theme.colors.emergency};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  color: white;
  font-size: ${theme.typography.fontSize.body};
  font-weight: 500;
  padding: 0 ${theme.spacing.large};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  margin: ${theme.spacing.xlarge} auto 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);

  &:hover {
    transform: translateY(-1px);
    background: #b91c1c;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.15);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

interface PreRegisterWorkflowProps {
  onExistingUser: () => void;
  onNewUser: () => void;
  onSwitchToEmergency: () => void;
}

export const PreRegisterWorkflow: React.FC<PreRegisterWorkflowProps> = ({
  onExistingUser,
  onNewUser,
  onSwitchToEmergency
}) => {
  return (
    <>
      <HeaderSection>
        <Title>Pre-register for Virtual ED</Title>
      </HeaderSection>

      <PreRegisterNotice>
        <NoticeTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          About Pre-registration
        </NoticeTitle>
        <NoticeList>
          <li>Your information will be securely stored for your next Virtual ED visit</li>
          <li>This process prepares your details in advance—it's not a booking or consultation</li>
        </NoticeList>
      </PreRegisterNotice>

      <ButtonContainer>
        <Button 
          variant="primary"
          onClick={onExistingUser}
        >
          Sign in with existing account
        </Button>
        
        <Button 
          variant="secondary"
          onClick={onNewUser}
        >
          Create new account
        </Button>
      </ButtonContainer>

      <EmergencySwitch onClick={onSwitchToEmergency}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        Need urgent care now? Switch to emergency
      </EmergencySwitch>
    </>
  );
}; 