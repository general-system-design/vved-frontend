import React from 'react';
import {
  WelcomeScreen as StyledWelcomeScreen,
  Title,
  Subtitle,
  MedicareNotice,
  MedicareText,
  MedicareTitle,
  MedicareDescription,
  MedicareActions,
  MedicareButton
} from '../ConversationalRegistration.styles';
import { Header } from '../../shared/Header';
import { EmergencyBanner } from '../../shared/EmergencyBanner';
import styled from 'styled-components';

// Professional icons using SVG
const MedicareCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const PrescriptionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z"/>
    <path d="M8 12h8"/>
    <path d="M12 8v8"/>
  </svg>
);

const ProcessingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
    <path d="M4.93 4.93l2.83 2.83"/>
    <path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/>
    <path d="M18 12h4"/>
    <path d="M4.93 19.07l2.83-2.83"/>
    <path d="M16.24 7.76l2.83-2.83"/>
  </svg>
);

const ConsultationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const EmergencyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.43 12h7.14"/>
    <path d="M12 15.57V8.43"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

interface WelcomeScreenProps {
  isEmergency: boolean;
  onStart: (medicareOption: 'with-medicare' | 'without-medicare' | 'not-eligible') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isEmergency, onStart }) => {
  return (
    <Container>
      <Header showLogo title="Virtual Emergency Department" />
      
      <StyledWelcomeScreen>
        <Title>
          {isEmergency ? 'Virtual ED Registration' : 'Welcome'}
        </Title>
        <Subtitle>
          {isEmergency
            ? "We'll now collect some details to help us prepare for your consultation."
            : "Let's get you registered for your visit. It only takes a few minutes."}
        </Subtitle>
        <MedicareNotice>
          <MedicareText>
            <MedicareTitle>
              <MedicareCardIcon />
              Medicare Card Information
            </MedicareTitle>
            <MedicareDescription>
              <div>
                <h3>With Medicare</h3>
                <ul>
                  <li><PrescriptionIcon />Get electronic prescriptions sent directly to your pharmacy</li>
                  <li><ProcessingIcon />Fast-tracked registration process</li>
                </ul>
              </div>
              <div>
                <h3>Without Medicare</h3>
                <ul>
                  <li><ConsultationIcon />Full medical consultation</li>
                  <li><EmergencyIcon />Complete emergency care access</li>
                </ul>
              </div>
            </MedicareDescription>
            <MedicareActions>
              <MedicareButton 
                variant="primary"
                onClick={() => onStart('with-medicare')}
              >
                Continue with Medicare
              </MedicareButton>
              <MedicareButton 
                variant="secondary"
                onClick={() => onStart('without-medicare')}
              >
                Continue without Medicare
              </MedicareButton>
              <MedicareButton 
                variant="text"
                onClick={() => onStart('not-eligible')}
              >
                I'm not eligible for Medicare
              </MedicareButton>
            </MedicareActions>
          </MedicareText>
        </MedicareNotice>
      </StyledWelcomeScreen>

      {isEmergency && <EmergencyBanner />}
    </Container>
  );
}; 