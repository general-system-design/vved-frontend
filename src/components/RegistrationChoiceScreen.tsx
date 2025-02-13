import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { PageLayout } from './Layout/PageLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';
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



const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xlarge};
  padding: ${theme.spacing.xlarge};
  max-width: 400px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  justify-content: center;
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
  max-width: 280px;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.xlarge};
  animation: ${fadeIn} 0.5s ease-out 0.2s backwards;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  width: 100%;
  height: 64px;
  border: 2px solid ${props => 
    props.variant === 'primary' ? 'transparent' : theme.colors.primary
  };
  border-radius: ${theme.borderRadius.medium};
  background-color: ${props => 
    props.variant === 'primary' ? theme.colors.primary : 'transparent'
  };
  color: ${props => 
    props.variant === 'primary' ? theme.colors.surface : theme.colors.primary
  };
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.h3};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.variant === 'primary' 
        ? '0 4px 12px rgba(0, 102, 204, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.05)'
    };
    background-color: ${props => 
      props.variant === 'primary' 
        ? theme.colors.primary 
        : 'rgba(0, 102, 204, 0.05)'
    };
  }

  &:active {
    transform: translateY(1px);
  }
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
  
  const handleExistingUser = () => {
    navigate(`/auth?type=${searchParams.get('type')}`);
  };
  
  const handleNewUser = () => {
    navigate(`/triage?type=${searchParams.get('type')}&isNew=true`);
  };
  
  return (
    <PageLayout 
      progress={10}
      showBack
      onBack={() => navigate('/')}
    >
      <div>
        <Header title={isEmergency ? 'Virtual ED Registration' : 'Registration'} />

        <Container>
          <div>
            <Title>Welcome</Title>
            <Subtitle>
              {isEmergency 
                ? "Let's get you help as quickly as possible"
                : "Let's get your registration started"
              }
            </Subtitle>
          </div>

          <ButtonContainer>
            <Button 
              variant="primary"
              onClick={handleExistingUser}
            >
              I've registered before
            </Button>
            
            <Button 
              variant="secondary"
              onClick={handleNewUser}
            >
              I'm new here
            </Button>
          </ButtonContainer>
          
          <InfoBox isEmergency={isEmergency}>
            <InfoText>
              {isEmergency 
                ? "If you're experiencing severe chest pain, difficulty breathing, or severe bleeding, please call emergency services (000) immediately."
                : "Pre-registering helps us prepare for your visit and can reduce your waiting time upon arrival."
              }
            </InfoText>
          </InfoBox>
        </Container>
        {isEmergency && <EmergencyBanner />}
      </div>
    </PageLayout>
  );
}; 