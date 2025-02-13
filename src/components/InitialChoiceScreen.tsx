import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { WaitTimeDisplay } from './WaitTimeDisplay/WaitTimeDisplay';
import { EmergencyBanner } from './shared/EmergencyBanner';
import { Header } from './shared/Header';

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

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(0, 102, 204, 0.15);
  }
  70% {
    transform: scale(1.005);
    box-shadow: 0 6px 24px rgba(0, 102, 204, 0.25);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(0, 102, 204, 0.15);
  }
`;

const countUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

const ScreenContainer = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xlarge} ${theme.spacing.xlarge};
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: calc(${theme.spacing.xlarge} * 3);
`;

const Logo = styled.div`
  font-family: ${theme.typography.fontFamily.header};
  font-size: 36px;
  color: ${theme.colors.text.primary};
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.5px;
  text-align: center;
  margin-bottom: ${theme.spacing.medium};
  
  span {
    display: block;
    font-size: 32px;
    color: ${theme.colors.primary};
    font-weight: 500;
    margin-top: ${theme.spacing.small};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.h3};
  color: ${theme.colors.text.secondary};
  max-width: 480px;
  margin: 0 auto ${theme.spacing.xlarge};
  line-height: 1.5;
  font-weight: 400;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.large};
  width: 100%;
  max-width: 480px;
  margin-bottom: ${theme.spacing.xlarge};
`;

const Button = styled.button<{ variant: 'emergency' | 'regular' }>`
  width: 100%;
  height: ${props => props.variant === 'emergency' ? '80px' : '56px'};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background: ${props => 
    props.variant === 'emergency' 
      ? `linear-gradient(to right, ${theme.colors.primary}, color-mix(in srgb, ${theme.colors.primary} 85%, white))`
      : 'white'};
  color: ${props => props.variant === 'emergency' ? 'white' : theme.colors.primary};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${props => props.variant === 'emergency' ? '22px' : '16px'};
  font-weight: ${props => props.variant === 'emergency' ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.medium};
  box-shadow: ${props => 
    props.variant === 'emergency'
      ? '0 4px 20px rgba(0, 102, 204, 0.15)'
      : 'none'};
  border: ${props => props.variant === 'regular' ? `1.5px solid ${theme.colors.primary}` : 'none'};
  
  ${props => props.variant === 'emergency' && css`
    animation: ${pulseAnimation} 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);

    &:hover {
      filter: brightness(0.95);
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(0, 102, 204, 0.25);
    }

    &:active {
      filter: brightness(0.9);
      transform: translateY(1px);
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);
    }
  `}

  &:hover {
    transform: translateY(-1px);
    ${props => props.variant === 'regular' && css`
      background: rgba(0, 102, 204, 0.05);
    `}
  }

  &:active {
    transform: translateY(1px);
  }
`;

interface InitialChoiceScreenProps {
  onEmergency: () => void;
  onPreRegister: () => void;
}

export const InitialChoiceScreen = ({ 
  onEmergency, 
  onPreRegister 
}: InitialChoiceScreenProps) => {
  return (
    <ScreenContainer>
      <Header showLogo title="Virtual Emergency Department" />
      
      <MainContent>
        <Logo>
          Virtual Emergency
          <span>Department</span>
        </Logo>
        
        <Subtitle>
          Secure, immediate access to emergency medical care from your location
        </Subtitle>
        
        <ButtonContainer>
          <Button 
            variant="emergency" 
            onClick={onEmergency}
            aria-label="Start virtual emergency assessment"
          >
            Start Virtual Emergency Consult
          </Button>
          
          <Button 
            variant="regular" 
            onClick={onPreRegister}
            aria-label="Pre-register for future visits"
          >
            Pre-register for Future Visits
          </Button>
        </ButtonContainer>
        
        <WaitTimeDisplay currentWaitTime={35} />
      </MainContent>

      <EmergencyBanner />
    </ScreenContainer>
  );
}; 