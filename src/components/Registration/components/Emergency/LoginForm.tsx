import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

const FormWrapper = styled.form`
  width: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  width: 100%;
  margin-bottom: ${theme.spacing.medium};
  background: white;
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.medium};
  background: ${props => props.hasError ? `${theme.colors.emergency}05` : 'white'};
  border: 1.5px solid ${props => props.hasError ? theme.colors.emergency : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: 16px;
  color: ${theme.colors.text.primary};
  transition: all 0.2s ease;
  box-shadow: ${props => props.hasError ? 'none' : 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'};

  &:hover:not(:disabled) {
    border-color: ${props => props.hasError ? theme.colors.emergency : theme.colors.primary};
    background: white;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? theme.colors.emergency : theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 
      `${theme.colors.emergency}15` : 
      `${theme.colors.primary}15`};
    background: white;
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(Input)`
  padding-right: 48px;
`;

const VisibilityToggle = styled.button`
  position: absolute;
  right: ${theme.spacing.small};
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.colors.surface};
  border: none;
  padding: 8px;
  border-radius: ${theme.borderRadius.small};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.text.disabled}20;
    color: ${theme.colors.text.primary};
  }
`;

const ErrorText = styled.span`
  color: ${theme.colors.emergency};
  font-size: ${theme.typography.fontSize.small};
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.large};
  margin-top: ${theme.spacing.large};
  width: 100%;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  width: 100%;
  height: ${props => props.variant === 'primary' ? '56px' : '56px'};
  background: ${props => props.variant === 'primary' 
    ? `linear-gradient(to right, ${theme.colors.primary}, color-mix(in srgb, ${theme.colors.primary} 85%, white))`
    : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : theme.colors.primary};
  border: ${props => props.variant === 'primary' ? 'none' : `1.5px solid ${theme.colors.primary}`};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${props => props.variant === 'primary' ? '18px' : '16px'};
  font-weight: ${props => props.variant === 'primary' ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  box-shadow: ${props => props.variant === 'primary' ? '0 4px 20px rgba(0, 102, 204, 0.15)' : 'none'};
  
  &:hover {
    transform: translateY(-1px);
    ${props => props.variant === 'primary' 
      ? `filter: brightness(0.95);
         box-shadow: 0 6px 24px rgba(0, 102, 204, 0.25);`
      : `background: rgba(0, 102, 204, 0.05);`
    }
  }

  &:active {
    transform: translateY(1px);
    ${props => props.variant === 'primary' 
      ? `filter: brightness(0.9);
         box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);`
      : ``
    }
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.small};
  padding: ${theme.spacing.small} 0;
  cursor: pointer;
  text-align: center;
  width: 100%;
  margin-top: ${theme.spacing.small};

  &:hover {
    text-decoration: underline;
  }
`;

interface LoginFormProps {
  onExistingUser: () => void;
  onNewUser: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onExistingUser, onNewUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Please enter your password';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onExistingUser();
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormContainer>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hasError={!!errors.email}
          placeholder="Email address"
        />
        {errors.email && (
          <ErrorText>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.email}
          </ErrorText>
        )}

        <PasswordWrapper>
          <PasswordInput
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hasError={!!errors.password}
            placeholder="Password"
          />
          <VisibilityToggle
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
          </VisibilityToggle>
        </PasswordWrapper>
        {errors.password && (
          <ErrorText>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.password}
          </ErrorText>
        )}

        <ForgotPasswordLink type="button" onClick={() => {}}>
          Forgot your password?
        </ForgotPasswordLink>
      </FormContainer>

      <ActionButtons>
        <Button variant="primary" type="submit">
          Sign in & Continue
        </Button>
        <Button variant="secondary" type="button" onClick={onNewUser}>
          Continue as new patient
        </Button>
      </ActionButtons>
    </FormWrapper>
  );
}; 