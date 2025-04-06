import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmergencyBanner } from '../shared/EmergencyBanner';
import { Header } from '../shared/Header';
import { MedicareOptionsModal } from '../Registration/components/Medicare/MedicareOptionsModal';
import { 
  ScreenContainer, 
  MainContent,
  ContentHeader,
  Heading,
  Tagline,
  ButtonContainer, 
  Button,
  ButtonText,
  ButtonSubtext,
  LoginSection,
  ReturningUserSection,
  ReturningUserHeader,
  ReturningUserTitle,
  ToggleIcon,
  InputGroup,
  Label,
  Input,
  InputIcon,
  LoginButton,
  ForgotPassword,
  SecureLoginNote,
  LockIcon,
  EmergencyBannerContainer,
  ArrowIcon,
  TrustContainer,
  GovernmentLogo,
  PreRegisterLink,
  PreRegisterText,
  PreRegisterSubtext,
  PreRegisterArrow
} from './styles';

interface ConsolidatedHomeScreenProps {
  onEmergencyRegistration?: () => void;
  onPreRegister: () => void;
}

export const ConsolidatedHomeScreen = ({
  onPreRegister
}: ConsolidatedHomeScreenProps) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showMedicareModal, setShowMedicareModal] = useState(false);
  const returningUserSectionRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const targetCount = 356000;
  const duration = 2000; // 2 seconds for the count animation
  
  useEffect(() => {
    // Start with a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      const startTime = Date.now();
      
      const updateCount = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          // Easing function for a more natural counting effect
          const progress = elapsedTime / duration;
          const easedProgress = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
          setCount(Math.floor(easedProgress * targetCount));
          requestAnimationFrame(updateCount);
        } else {
          setCount(targetCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format the count with commas
  const formattedCount = count.toLocaleString();

  const handleStartConsult = () => {
    // Show Medicare options modal instead of direct navigation
    setShowMedicareModal(true);
  };

  const handleMedicareOptionSelected = (medicareOption: 'with-medicare' | 'without-medicare' | 'not-eligible') => {
    // Close the modal
    setShowMedicareModal(false);
    
    // Navigate to registration with the selected Medicare option
    navigate(`/register?type=emergency&medicareChoice=${medicareOption}`);
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
    navigate('/auth');
  };


  return (
    <ScreenContainer>
      <Header showLogo title="Virtual Emergency Department" />
      
      <EmergencyBannerContainer>
        <EmergencyBanner />
      </EmergencyBannerContainer>
      
      <MainContent>
        <ContentHeader>
          <Heading>
            Emergency medical care when you need it, wherever you are
          </Heading>
          <Tagline>
            Connect with emergency physicians through secure video - trusted by{' '}
            <span className="counter-value">
              {formattedCount.split('').map((digit, index) => (
                <span key={index} className="digit">{digit}</span>
              ))}
            </span>{' '}
            patients across Victoria
          </Tagline>
        </ContentHeader>
        
        <ButtonContainer>
          <Button 
            variant="emergency" 
            onClick={handleStartConsult}
            aria-label="Start virtual emergency assessment"
          >
            <ButtonText>
              Start Consult
              <ButtonSubtext>New Patient / No Account</ButtonSubtext>
            </ButtonText>
            <ArrowIcon />
          </Button>
          
          <ReturningUserSection ref={returningUserSectionRef}>
            <ReturningUserHeader onClick={handleExistingUser}>
              <ReturningUserTitle>
                Existing Patient / Login
              </ReturningUserTitle>
              <ToggleIcon isOpen={showLogin}>▼</ToggleIcon>
            </ReturningUserHeader>
            
            {showLogin && (
              <LoginSection>
                <form onSubmit={handleLogin}>
                  <InputGroup>
                    <Label htmlFor="email">Email</Label>
                    <InputIcon data-icon="email" />
                    <Input 
                      id="email" 
                      type="email" 
                      required
                      autoComplete="email"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label htmlFor="password">Password</Label>
                    <InputIcon data-icon="password" />
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
        </ButtonContainer>
        
        <PreRegisterLink 
          onClick={onPreRegister}
          aria-label="Pre-register for future visits"
        >
          <PreRegisterText>
            Pre-register your account today
            <PreRegisterSubtext>and save time when you need us</PreRegisterSubtext>
          </PreRegisterText>
          <PreRegisterArrow>→</PreRegisterArrow>
        </PreRegisterLink>

        <TrustContainer>
          <GovernmentLogo 
            src="/Victoria-State-Government-logo-blue-PMS-2945.png" 
            alt="Victorian State Government" 
          />
        </TrustContainer>
      </MainContent>
      
      {showMedicareModal && (
        <MedicareOptionsModal 
          onClose={() => setShowMedicareModal(false)}
          onSelect={handleMedicareOptionSelected}
        />
      )}
    </ScreenContainer>
  );
}; 