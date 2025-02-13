import { useState, useEffect, KeyboardEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../Layout/PageLayout';
import { useConversationFlow } from './useConversationFlow';

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
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background: ${theme.colors.surface};
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: ${theme.spacing.medium};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
`;

const Message = styled.div<{ isUser?: boolean }>`
  max-width: 85%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  animation: ${fadeIn} 0.3s ease-out;
`;

const MessageContent = styled.div<{ isUser?: boolean }>`
  background: ${props => props.isUser ? theme.colors.primary : '#F0F4F8'};
  color: ${props => props.isUser ? 'white' : theme.colors.text.primary};
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.emergency};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.small};
  animation: ${fadeIn} 0.3s ease-out;
`;

const HelpText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.small};
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.medium};
  border: 1.5px solid ${props => 
    props.hasError ? theme.colors.emergency : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.body};
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : theme.colors.primary};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.medium};
  border: 1.5px solid ${props => 
    props.hasError ? theme.colors.emergency : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.body};
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : theme.colors.primary};
  }
`;

const Button = styled.button`
  height: 48px;
  padding: 0 ${theme.spacing.large};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.body};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  padding: ${theme.spacing.medium};
  border-top: 1px solid ${theme.colors.text.disabled};
  display: flex;
  gap: ${theme.spacing.medium};
  background: white;
`;

const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.xlarge};
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h1};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.h3};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xlarge};
  line-height: 1.5;
`;

const EstimatedTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.medium};
`;

const TimeIcon = styled.span`
  font-size: 1.2em;
`;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export const ConversationalRegistrationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const isEmergency = searchParams.get('type') === 'emergency';
  
  const {
    currentStep,
    formData,
    error,
    progress,
    handleAnswer,
    goBack,
    isComplete
  } = useConversationFlow(isEmergency);

  const startRegistration = () => {
    setShowWelcome(false);
    setMessages([
      {
        id: '1',
        content: isEmergency 
          ? "I'll help you register as quickly as possible. Please have your Medicare card ready."
          : "I'll help you register for your visit. Please have your Medicare card ready.",
        isUser: false
      }
    ]);
  };

  const handleSubmit = () => {
    if (!currentInput.trim()) return;

    const success = handleAnswer(currentInput);
    
    if (success) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), content: currentInput, isUser: true },
        { id: (Date.now() + 1).toString(), content: currentStep.question, isUser: false }
      ]);
      setCurrentInput('');

      if (isComplete) {
        navigate('/confirmation', {
          state: {
            registrationData: formData,
            type: searchParams.get('type')
          }
        });
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!showWelcome && messages.length === 1) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), content: currentStep.question, isUser: false }
      ]);
    }
  }, [showWelcome, currentStep]);

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
          <Button onClick={startRegistration}>
            Start Registration
          </Button>
          <EstimatedTime>
            <TimeIcon>⏱</TimeIcon>
            Takes about {isEmergency ? '2-3' : '3-4'} minutes
          </EstimatedTime>
        </WelcomeScreen>
      </PageLayout>
    );
  }

  return (
    <PageLayout progress={progress}>
      <Container>
        <ChatContainer>
          {messages.map(message => (
            <Message key={message.id} isUser={message.isUser}>
              <MessageContent isUser={message.isUser}>
                {message.content}
              </MessageContent>
            </Message>
          ))}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {currentStep.helpText && <HelpText>{currentStep.helpText}</HelpText>}
        </ChatContainer>
        <InputContainer>
          {currentStep.type === 'select' ? (
            <Select
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              hasError={!!error}
            >
              <option value="">Select an option</option>
              {currentStep.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type={currentStep.type}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentStep.placeholder}
              pattern={currentStep.pattern}
              hasError={!!error}
            />
          )}
          <Button onClick={handleSubmit}>
            Continue
          </Button>
        </InputContainer>
      </Container>
    </PageLayout>
  );
}; 