import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../Layout/PageLayout';
import { useRegistrationFlow } from './hooks/useRegistrationFlow';
import { RegistrationStep, RegistrationData } from './types';
import { EmergencyBanner } from '../shared/EmergencyBanner';
import { Header } from '../shared/Header';

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

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

interface ContainerProps {
  isEmergency?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: ${theme.colors.surface};
  min-height: 100vh;
  position: relative;
  padding-bottom: ${props => props.isEmergency ? '160px' : '80px'};
`;

const FormContainer = styled.div`
  padding: ${theme.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.large};
  flex: 1;
  margin-bottom: ${theme.spacing.xlarge};
  min-height: calc(100vh - 200px);
  justify-content: center;
  align-items: center;
`;

const QuestionContainer = styled.div<{ isExiting?: boolean }>`
  background: white;
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xlarge};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
  animation: ${props => props.isExiting ? slideOutLeft : slideInRight} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isExiting ? 0 : 1};
  transform: translateX(${props => props.isExiting ? '-30px' : '0'});
  will-change: transform, opacity;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.primary};
    opacity: 0.8;
    border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
  }
`;

const Question = styled.div`
  font-size: ${theme.typography.fontSize.h2};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.large};
  font-family: ${theme.typography.fontFamily.header};
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: -0.3px;
  animation: ${fadeInScale} 0.4s ease-out;
`;

const InputWrapper = styled.div`
  margin-bottom: ${theme.spacing.medium};
`;

const InputLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.small};
  font-weight: 500;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 ${theme.spacing.large};
  border: 1.5px solid ${props => 
    props.hasError ? theme.colors.emergency : 
    theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  background: white;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : 
      theme.colors.text.primary};
    background: white;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : theme.colors.primary};
    border-width: 2px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 ${theme.spacing.large};
  border: 1.5px solid ${props => 
    props.hasError ? theme.colors.emergency : 
    theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  background: white;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%232C3E50' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.large} center;
  padding-right: ${theme.spacing.xlarge};
  
  &:hover {
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : 
      theme.colors.text.primary};
    background: white;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : theme.colors.primary};
    border-width: 2px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`;

const HelpText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.medium};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.medium};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.medium};
  line-height: 1.5;

  &::before {
    content: 'ℹ';
    color: ${theme.colors.primary};
    font-size: 16px;
    margin-top: -2px;
  }
`;

const BooleanButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.medium};
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  height: 56px;
  min-width: 140px;
  padding: 0 ${theme.spacing.large};
  background: ${props => props.variant === 'secondary' ? theme.colors.surface : theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? theme.colors.primary : 'white'};
  border: ${props => props.variant === 'secondary' ? `2px solid ${theme.colors.primary}` : 'none'};
  border-radius: ${theme.borderRadius.medium};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.variant === 'secondary' ? 
      '0 2px 4px rgba(0, 0, 0, 0.1)' : 
      '0 4px 12px rgba(0, 102, 204, 0.2)'};
    background: ${props => props.variant === 'secondary' ? 
      'rgba(255, 255, 255, 0.9)' : 
      theme.colors.primary};
    filter: ${props => props.variant === 'primary' ? 'brightness(1.1)' : 'none'};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: ${props => props.variant === 'secondary' ? 'white' : theme.colors.text.disabled};
  }
`;

interface NavigationContainerProps {
  isEmergency?: boolean;
}

const NavigationContainer = styled.div<NavigationContainerProps>`
  position: fixed;
  bottom: ${props => props.isEmergency ? '80px' : '0'};
  left: 0;
  right: 0;
  background: white;
  z-index: 11;
`;

const ButtonContainer = styled.div<{ isEmergency?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background: white;
  border-top: 1px solid ${theme.colors.text.disabled};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  height: 48px;
  min-width: 140px;
  padding: 0 ${theme.spacing.large};
  background: ${props => props.variant === 'secondary' ? 'white' : 
    `linear-gradient(to right, ${theme.colors.primary}, color-mix(in srgb, ${theme.colors.primary} 85%, white))`};
  color: ${props => props.variant === 'secondary' ? theme.colors.primary : 'white'};
  border: ${props => props.variant === 'secondary' ? `1.5px solid ${theme.colors.primary}` : 'none'};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.body};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 14px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.variant === 'secondary' ? 
      '0 2px 4px rgba(0, 0, 0, 0.1)' : 
      '0 4px 12px rgba(0, 102, 204, 0.2)'};
    background: ${props => props.variant === 'secondary' ? 
      'white' : 
      `linear-gradient(to right, color-mix(in srgb, ${theme.colors.primary} 90%, black), color-mix(in srgb, ${theme.colors.primary} 75%, white))`};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: ${props => props.variant === 'secondary' ? 'white' : theme.colors.text.disabled};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.emergency};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.small};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};

  &::before {
    content: '⚠';
  }
`;

const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.xlarge};
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  background: white;
  border-radius: ${theme.borderRadius.large};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: 42px;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.5px;
  
  &::before {
    content: '⚕️';
    font-size: 36px;
    display: block;
    margin-bottom: ${theme.spacing.medium};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.h3};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xlarge};
  line-height: 1.5;
  max-width: 480px;
  font-weight: 400;
`;

const StartButton = styled(Button)`
  height: 56px;
  min-width: 200px;
  font-size: 16px;
  background: ${theme.colors.primary};
  border: none;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
  margin-bottom: ${theme.spacing.large};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.3);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
  }
`;

const EstimatedTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.body};
  margin-top: ${theme.spacing.medium};
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TimeIcon = styled.span`
  font-size: 20px;
  color: ${theme.colors.primary};
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.medium};
  background: white;
  border-bottom: 1px solid ${theme.colors.text.disabled};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => 
    props.active ? theme.colors.primary : 
    props.completed ? theme.colors.text.primary :
    theme.colors.text.disabled};
  font-size: 12px;
  white-space: nowrap;
  padding: ${theme.spacing.small} 0;
`;

const StepNumber = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.active ? theme.colors.primary :
    props.completed ? theme.colors.text.primary :
    'transparent'};
  color: ${props => 
    (props.active || props.completed) ? 'white' : theme.colors.text.disabled};
  border: 1.5px solid ${props => 
    props.active ? theme.colors.primary :
    props.completed ? theme.colors.text.primary :
    theme.colors.text.disabled};
  font-size: 12px;
  font-weight: 500;
`;

const StepDivider = styled.div`
  width: 12px;
  height: 1px;
  background: ${theme.colors.text.disabled};
  margin: 0 2px;
`;

export const ConversationalRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentInputs, setCurrentInputs] = useState<Partial<RegistrationData>>({});
  const isEmergency = searchParams.get('type') === 'emergency';
  const [isExiting, setIsExiting] = useState(false);
  
  const {
    currentStep,
    currentSteps,
    formData,
    error,
    progress,
    handleAnswer,
    goBack,
    isComplete,
    resetForm
  } = useRegistrationFlow(isEmergency);

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setCurrentInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = async () => {
    const fieldsToSubmit = currentSteps.map(step => step.field);
    const answer = fieldsToSubmit.reduce((acc, field) => ({
      ...acc,
      [field]: currentInputs[field]?.toString() || formData[field]?.toString() || ''
    }), {} as Record<string, string>);
    
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    handleAnswer(answer);
    setCurrentInputs({});
    
    setTimeout(() => {
      setIsExiting(false);
    }, 50);
  };

  const renderInput = (step: RegistrationStep) => {
    const value = currentInputs[step.field]?.toString() || formData[step.field]?.toString() || '';
    const hasError = !!error;

    switch (step.type) {
      case 'select':
        return (
          <InputWrapper>
            <InputLabel>{step.placeholder || 'Select an option'}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              hasError={hasError}
            >
              <option value="">Select an option</option>
              {step.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </InputWrapper>
        );
      case 'boolean':
        return (
          <BooleanButtonGroup>
            <StyledButton 
              variant="secondary"
              onClick={() => {
                handleInputChange(step.field, 'true');
                handleContinue();
              }}
            >
              Yes
            </StyledButton>
            <StyledButton 
              variant="secondary"
              onClick={() => {
                handleInputChange(step.field, 'false');
                handleContinue();
              }}
            >
              No
            </StyledButton>
          </BooleanButtonGroup>
        );
      default:
        return (
          <InputWrapper>
            <InputLabel>{step.placeholder}</InputLabel>
            <Input
              type={step.type}
              value={value}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
              placeholder={step.placeholder}
              pattern={step.pattern}
              hasError={hasError}
            />
          </InputWrapper>
        );
    }
  };

  const startRegistration = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <PageLayout progress={0}>
        <WelcomeScreen>
          <Title>
            {isEmergency ? 'Virtual ED Registration' : 'Welcome'}
          </Title>
          <Subtitle>
            {isEmergency
              ? "Let's get you registered quickly so we can provide the care you need."
              : "Let's get you registered for your visit."}
          </Subtitle>
          <StartButton onClick={startRegistration}>
            Start Registration
          </StartButton>
          <EstimatedTime>
            <TimeIcon>⏱</TimeIcon>
            Takes less than {isEmergency ? '2' : '3'} minutes
          </EstimatedTime>
        </WelcomeScreen>
      </PageLayout>
    );
  }

  if (isComplete) {
    navigate('/confirmation', {
      state: {
        registrationData: formData,
        type: searchParams.get('type')
      }
    });
    return null;
  }

  const currentQuestion = typeof currentStep.question === 'function' 
    ? currentStep.question(formData) 
    : currentStep.question;

  const currentHelpText = typeof currentStep.helpText === 'function'
    ? currentStep.helpText(formData)
    : currentStep.helpText;

  return (
    <PageLayout 
      showBack
      onBack={goBack}
    >
      <Container isEmergency={isEmergency}>
        <Header title={isEmergency ? 'Virtual ED Registration' : 'Registration'} />

        <FormContainer>
          <QuestionContainer isExiting={isExiting}>
            {currentSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                {(index === 0 || !step.skipQuestion) && (
                  <Question>
                    {typeof step.question === 'function' 
                      ? step.question(formData) 
                      : step.question}
                  </Question>
                )}
                {renderInput(step)}
              </React.Fragment>
            ))}
            {currentHelpText && <HelpText>{currentHelpText}</HelpText>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </QuestionContainer>
        </FormContainer>

        <NavigationContainer isEmergency={isEmergency}>
          <ButtonContainer isEmergency={isEmergency}>
            <Button 
              variant="secondary" 
              onClick={goBack}
              disabled={!progress}
            >
              ← Back
            </Button>
            <Button onClick={handleContinue}>
              Continue →
            </Button>
          </ButtonContainer>
        </NavigationContainer>

        {isEmergency && <EmergencyBanner />}
      </Container>
    </PageLayout>
  );
}; 