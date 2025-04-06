import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { PageLayout } from './Layout/PageLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmergencyBanner } from './shared/EmergencyBanner';
import { Header } from './shared/Header';
import { useState, useRef } from 'react';
import React from 'react';
import { MedicareOptionsModal } from './Registration/components/Medicare/MedicareOptionsModal';

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

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.large};
  padding: ${theme.spacing.large};
  max-width: 520px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  justify-content: flex-start;
  padding-top: calc(${theme.spacing.xlarge} * 1.5);
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: calc(${theme.spacing.xlarge} * 3);
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h1};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
  max-width: 320px;
  margin: 0 auto;
`;

const NewUserCard = styled.div<{ isEmergency?: boolean }>`
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.large} ${theme.spacing.large} ${theme.spacing.xlarge};
  color: white;
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.2);
  margin-top: ${theme.spacing.medium};
  animation: ${fadeIn} 0.5s ease-out 0.2s backwards;
  position: relative;
  overflow: hidden;
  text-align: center;
  max-width: 440px;
  margin-left: auto;
  margin-right: auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }
  
  ${props => props.isEmergency && css`
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, #0052a3 100%);
    background-size: 200% 200%;
    animation: ${gradientAnimation} 15s ease infinite;
    
    &::after {
      content: '⚡';
      position: absolute;
      top: ${theme.spacing.small};
      right: ${theme.spacing.small};
      font-size: 20px;
      opacity: 0.5;
    }
  `}
`;

const CardTitle = styled.h2<{ isEmergency?: boolean }>`
  font-size: ${props => props.isEmergency ? '28px' : theme.typography.fontSize.h3};
  font-weight: 600;
  margin-bottom: ${theme.spacing.small};
  line-height: 1.2;
  letter-spacing: -0.5px;
  text-align: center;
`;

const CardDescription = styled.p<{ isEmergency?: boolean }>`
  font-size: ${props => props.isEmergency ? '16px' : theme.typography.fontSize.body};
  opacity: 0.95;
  margin-bottom: ${theme.spacing.large};
  max-width: 90%;
  line-height: 1.5;
  font-weight: ${props => props.isEmergency ? '400' : 'normal'};
  margin-left: auto;
  margin-right: auto;
`;

const PreviousAction = styled.div`
  font-size: ${theme.typography.fontSize.small};
  opacity: 0.8;
  margin-bottom: ${theme.spacing.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  
  &::before {
    content: '←';
    font-size: 14px;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background-color: white;
  color: ${theme.colors.primary};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.body};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    background-color: rgba(255, 255, 255, 0.9);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ReturningUserSection = styled.div`
  background: #EBF4FF;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium};
  margin-top: ${theme.spacing.large};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
  border: 1px solid rgba(0, 102, 204, 0.15);
  scroll-margin-top: 20vh;
`;

const ReturningUserHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${theme.spacing.small} 0;
  position: relative;
`;

const ReturningUserTitle = styled.h3`
  font-size: ${theme.typography.fontSize.body};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  
  &::before {
    content: '👤';
    font-size: 16px;
  }
`;

const ReturningUserSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.small};
  line-height: 1.4;
  text-align: center;
`;

const ToggleIcon = styled.span<{ isOpen: boolean }>`
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: 18px;
`;

const LoginSection = styled.div`
  padding-top: ${theme.spacing.medium};
  animation: ${slideUp} 0.4s ease-out;
  background: white;
  border-radius: 0 0 ${theme.borderRadius.medium} ${theme.borderRadius.medium};
  padding: ${theme.spacing.large};
  position: relative;
  margin-top: ${theme.spacing.small};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;
    height: 2px;
    background: rgba(0, 102, 204, 0.15);
    border-radius: 2px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.medium};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.small};
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  margin-bottom: 4px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.medium} 0 38px;
  border: 1px solid rgba(0, 102, 204, 0.2);
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  font-family: inherit;
  line-height: 1.5;
  background: white;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }

  &::placeholder {
    color: #A0AEC0;
    font-size: ${theme.typography.fontSize.small};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  bottom: 15px;
  color: rgba(0, 102, 204, 0.5);
  font-size: 16px;
  pointer-events: none;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${theme.spacing.medium};
  font-size: ${theme.typography.fontSize.body};
  text-transform: none;
  letter-spacing: 0;

  &:hover {
    background-color: #0066cc;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 102, 204, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ForgotPassword = styled.a`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.primary};
  text-align: right;
  display: block;
  margin-top: 4px;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SecureLoginNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  margin-top: ${theme.spacing.medium};
  font-size: 12px;
  color: rgba(0, 102, 204, 0.6);
`;

const LockIcon = styled.span`
  font-size: 12px;
  color: rgba(0, 102, 204, 0.6);
`;

const InfoBox = styled.div<{ isEmergency?: boolean }>`
  background: ${props => 
    props.isEmergency 
      ? 'rgba(220, 38, 38, 0.05)'
      : 'rgba(0, 102, 204, 0.05)'
  };
  border-left: 3px solid ${props => 
    props.isEmergency 
      ? theme.colors.emergency
      : theme.colors.primary
  };
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius.medium};
  margin-top: ${theme.spacing.medium};
  animation: ${fadeIn} 0.5s ease-out 0.3s backwards;
`;

const InfoText = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.primary};
  line-height: 1.5;
  margin: 0;
`;

export const RegistrationChoiceScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmergency = searchParams.get('type') === 'emergency';
  const [showLogin, setShowLogin] = useState(false);
  const [showMedicareModal, setShowMedicareModal] = useState(false);
  const returningUserSectionRef = useRef<HTMLDivElement>(null);
  
  const handleContinueAsNew = () => {
    navigate(`/register?type=${searchParams.get('type')}&isNew=true`);
  };

  const handleEmergencyRegistration = () => {
    // Show Medicare options modal instead of direct navigation
    setShowMedicareModal(true);
  };

  const handleMedicareOptionSelected = (medicareOption: 'with-medicare' | 'without-medicare' | 'not-eligible') => {
    // Close the modal
    setShowMedicareModal(false);
    
    // Navigate to registration with the selected Medicare option
    navigate(`/registration?type=emergency&medicareChoice=${medicareOption}`);
  };

  const handleExistingUser = () => {
    // Toggle login form visibility
    setShowLogin(!showLogin);
    
    // If opening the login form, scroll to it after a short delay
    if (!showLogin) {
      setTimeout(() => {
        returningUserSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    navigate(`/auth?type=${searchParams.get('type')}`);
  };
  
  return (
    <>
      <Header showLogo title="Virtual Emergency Department" />
      <Container>
        <NewUserCard isEmergency={isEmergency}>
          <CardTitle isEmergency={isEmergency}>
            {isEmergency ? "Emergency Registration" : "New Registration"}
          </CardTitle>
          
          <CardDescription isEmergency={isEmergency}>
            {isEmergency 
              ? "Quick registration process with no account required."
              : "Continue without an account to get started right away. No login needed."
            }
          </CardDescription>
          
          <PrimaryButton onClick={handleEmergencyRegistration}>
            {isEmergency 
              ? "Start Emergency Registration" 
              : "Continue Without Account"
            }
          </PrimaryButton>
        </NewUserCard>
        
        <ReturningUserSection ref={returningUserSectionRef}>
          <ReturningUserHeader onClick={handleExistingUser}>
            <ReturningUserTitle>
              I already have an account
            </ReturningUserTitle>
            <ToggleIcon isOpen={showLogin}>▼</ToggleIcon>
          </ReturningUserHeader>
          
          {showLogin && (
            <LoginSection>
              <form onSubmit={handleLogin}>
                <InputGroup>
                  <Label htmlFor="email">Email</Label>
                  <InputIcon>✉️</InputIcon>
                  <Input 
                    id="email" 
                    type="email" 
                    required
                    autoComplete="email"
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputIcon>🔒</InputIcon>
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    autoComplete="current-password"
                  />
                </InputGroup>
                <ForgotPassword>Forgot password?</ForgotPassword>
                <LoginButton type="submit">SIGN IN</LoginButton>
                <SecureLoginNote>
                  <LockIcon>🔒</LockIcon> Secure, encrypted connection
                </SecureLoginNote>
              </form>
            </LoginSection>
          )}
        </ReturningUserSection>
        
        <ReturningUserSubtitle>
          Users with an account can express register
        </ReturningUserSubtitle>
        
        {!isEmergency && (
          <InfoBox isEmergency={false}>
            <InfoText>
              Pre-registering helps us prepare for your visit and can reduce your waiting time upon arrival.
            </InfoText>
          </InfoBox>
        )}
      </Container>
      {isEmergency && <EmergencyBanner />}
      
      {/* Medicare Options Modal */}
      {showMedicareModal && (
        <MedicareOptionsModal 
          onClose={() => setShowMedicareModal(false)}
          onSelect={handleMedicareOptionSelected}
        />
      )}
    </>
  );
}; 