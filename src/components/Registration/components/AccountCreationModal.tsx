import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import type { RegistrationData } from '../types/index';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: ${theme.spacing.medium};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.large} ${theme.spacing.large} ${theme.spacing.medium};
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
  max-height: min(720px, calc(100vh - ${theme.spacing.xlarge}));
  overflow-y: auto;
  margin: auto;

  @media (max-width: 480px) {
    padding: ${theme.spacing.medium};
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Custom scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.text.disabled};
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.medium};
  right: ${theme.spacing.medium};
  background: rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.small};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }
`;

const Title = styled.h2`
  font-size: 20px;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  font-weight: 600;
  line-height: 1.2;

  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.primary};
  }
`;

const Description = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 16px;
  margin-bottom: ${theme.spacing.large};
  line-height: 1.6;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};

  @media (max-height: 844px) {
    gap: ${theme.spacing.small};
  }
`;

const AccountToggle = styled.button<{ active: boolean }>`
  background: ${props => props.active ? `${theme.colors.primary}10` : 'white'};
  border: 1.5px solid ${props => props.active ? theme.colors.primary : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? `${theme.colors.primary}15` : `${theme.colors.primary}05`};
    transform: translateY(-1px);
  }
`;

const ToggleText = styled.div`
  text-align: left;
`;

const ToggleTitle = styled.div`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
  font-size: 18px;
`;

const ToggleDescription = styled.div`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

interface InputProps {
  hasError?: boolean;
}

const ERROR_COLOR = '#DC2626'; // Using a standard error red color

const InputBase = styled.input<InputProps>`
  width: 100%;
  height: 44px;
  padding: 0 ${theme.spacing.medium};
  border: 1.5px solid ${props => props.hasError ? ERROR_COLOR : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: 15px;
  color: ${theme.colors.text.primary};
  background: white;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
  
  &:hover:not(:disabled) {
    border-color: ${props => props.hasError ? ERROR_COLOR : theme.colors.text.secondary};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? ERROR_COLOR : theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? `${ERROR_COLOR}10` : `${theme.colors.primary}10`};
  }

  &:disabled {
    background: ${theme.colors.surface};
    color: ${theme.colors.text.secondary};
    cursor: default;
  }
`;

const EmailInput = styled(InputBase)``;

const PasswordInput = styled(InputBase)`
  padding-right: 44px;
`;

const VisibilityButton = styled.button`
  position: absolute;
  right: ${theme.spacing.small};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.small};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    color: ${theme.colors.text.primary};
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${theme.spacing.medium};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.small};
  color: ${theme.colors.text.primary};
  font-size: 14px;
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    color: ${theme.colors.success};
    width: 16px;
    height: 16px;
    opacity: 0.8;
    margin-top: 2px;
  }
`;

const Requirements = styled.ul<{ isFocused: boolean }>`
  list-style: none;
  margin: ${theme.spacing.small} 0;
  padding: ${theme.spacing.small} ${theme.spacing.small} ${theme.spacing.base};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.small} ${theme.spacing.medium};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.small};
  margin-bottom: ${theme.spacing.base};
  transition: opacity 0.2s ease;
  opacity: ${props => props.isFocused ? 1 : 0.7};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.small};
  }
`;

const RequirementItem = styled.li<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  color: ${props => props.met ? theme.colors.success : theme.colors.text.secondary};
  font-size: 13px;
  transition: all 0.2s ease;
  opacity: ${props => props.met ? 1 : 0.7};

  &::before {
    content: ${props => props.met ? '"✓"' : '"○"'};
    font-size: 14px;
    color: ${props => props.met ? theme.colors.success : theme.colors.text.disabled};
    line-height: 1;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
  margin-top: ${theme.spacing.small};
`;

const SetupLaterText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 13px;
  text-align: center;
  margin-top: 4px;
`;

const ErrorText = styled.div`
  color: ${ERROR_COLOR};
  font-size: 13px;
  margin-top: 4px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  height: 44px;
  padding: 0 ${theme.spacing.medium};
  background: ${props => props.variant === 'secondary' ? 'white' : 
    `linear-gradient(to bottom, ${theme.colors.primary}, ${theme.colors.primary}ee)`};
  color: ${props => props.variant === 'secondary' ? theme.colors.text.primary : 'white'};
  border: 1.5px solid ${props => props.variant === 'secondary' ? theme.colors.text.disabled : 'transparent'};
  border-radius: ${theme.borderRadius.medium};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.variant === 'secondary' ? 'none' : '0 2px 8px rgba(0, 102, 204, 0.2)'};

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.variant === 'secondary' ? 
      theme.colors.surface : 
      `linear-gradient(to bottom, ${theme.colors.primary}ee, ${theme.colors.primary})`};
    border-color: ${props => props.variant === 'secondary' ? theme.colors.text.secondary : 'transparent'};
    box-shadow: ${props => props.variant === 'secondary' ? 'none' : '0 4px 12px rgba(0, 102, 204, 0.3)'};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.variant === 'secondary' ? 'none' : '0 2px 4px rgba(0, 102, 204, 0.2)'};
  }
`;

const SkipText = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 13px;
  margin-top: ${theme.spacing.small};
`;

interface Props {
  onClose: () => void;
  onComplete: (createAccount: boolean, password: string) => void;
  registrationData: {
    email?: string;
  } & Omit<RegistrationData, 'email'>;
  context?: 'pre-registration' | 'post-visit';
}

export const AccountCreationModal: React.FC<Props> = ({
  onClose,
  onComplete,
  registrationData,
  context = 'post-visit'
}) => {
  const [createAccount, setCreateAccount] = useState(true);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(registrationData.email || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus email input if no email provided, otherwise focus password
    if (!registrationData.email && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [registrationData.email]);

  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    });
  }, [password]);

  const allRequirementsMet = Object.values(requirements).every(Boolean);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleComplete = () => {
    setShowErrors(true);
    
    if (!password || !allRequirementsMet || (!registrationData.email && !isValidEmail)) {
      return;
    }
    
    onComplete(true, password);
  };

  const emailError = showErrors && !registrationData.email && !isValidEmail ? 
    "Please enter a valid email address" : undefined;
  const passwordError = showErrors && (!password || !allRequirementsMet) ?
    "Please enter a valid password meeting all requirements" : undefined;

  const getContextualContent = () => {
    if (context === 'pre-registration') {
      return {
        title: 'Create Your Account',
        benefits: [
          {
            text: 'Start your registration process now',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )
          },
          {
            text: 'Save time during your visit',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )
          },
          {
            text: 'Access your registration status anytime',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )
          }
        ],
        primaryButton: 'Create Account & Continue',
        showSecondaryButton: false
      };
    }

    return {
      title: 'Set Up Your Account',
      benefits: [
        {
          text: 'Faster check-ins for future visits',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )
        },
        {
          text: 'Secure access to your health information',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )
        }
      ],
      primaryButton: 'Complete Registration',
      secondaryButton: 'Set Up Later',
      setupLaterText: "We'll email you a setup link to complete later",
      showSecondaryButton: true
    };
  };

  const contextContent = getContextualContent();

  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={onClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>

        <Title>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {contextContent.title}
        </Title>

        <BenefitsList>
          {contextContent.benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              {benefit.icon}
              {benefit.text}
            </BenefitItem>
          ))}
        </BenefitsList>

        <Form>
          <div>
            <EmailInput
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!registrationData.email}
              placeholder={!registrationData.email ? "Enter your email address" : undefined}
              aria-label="Email address"
              hasError={!!emailError}
            />
            {emailError && <ErrorText>{emailError}</ErrorText>}
          </div>

          <div>
            <PasswordInputWrapper>
              <PasswordInput
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                aria-label="Password"
                hasError={!!passwordError}
              />
              <VisibilityButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </VisibilityButton>
            </PasswordInputWrapper>
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
          </div>

          <Requirements isFocused={isPasswordFocused || password.length > 0} role="list" aria-label="Password requirements">
            <RequirementItem met={requirements.length}>
              At least 8 characters
            </RequirementItem>
            <RequirementItem met={requirements.uppercase}>
              One uppercase letter
            </RequirementItem>
            <RequirementItem met={requirements.lowercase}>
              One lowercase letter
            </RequirementItem>
            <RequirementItem met={requirements.number}>
              One number
            </RequirementItem>
          </Requirements>
        </Form>

        <Actions>
          <Button
            onClick={handleComplete}
          >
            {contextContent.primaryButton}
          </Button>
          {contextContent.showSecondaryButton && (
            <>
              <Button
                variant="secondary"
                onClick={() => onComplete(false, '')}
              >
                {contextContent.secondaryButton}
              </Button>
              <SetupLaterText>
                {contextContent.setupLaterText}
              </SetupLaterText>
            </>
          )}
        </Actions>
      </ModalContent>
    </Modal>
  );
}; 