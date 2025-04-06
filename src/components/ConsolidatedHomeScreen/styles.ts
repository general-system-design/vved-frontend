import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';

// Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInStaggered = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const numberFlicker = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

export const pulseAnimation = keyframes`
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

// Container styles
export const ScreenContainer = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: ${theme.spacing.large} ${theme.spacing.xlarge};
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: calc(${theme.spacing.xlarge} * 2);
`;

// New header components
export const ContentHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.medium};
  width: 100%;
  position: relative;
  padding: ${theme.spacing.medium} ${theme.spacing.small};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(180deg, 
      rgba(0, 102, 204, 0.04) 0%, 
      rgba(0, 102, 204, 0) 100%);
    border-radius: ${theme.borderRadius.large};
    z-index: -1;
  }
`;

export const Heading = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.3;
  margin: 0 0 ${theme.spacing.medium};
  text-align: center;
  letter-spacing: -0.4px;
  animation: ${fadeInStaggered} 0.7s ease-out forwards;
  background: linear-gradient(135deg, #003366 0%, #0066cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
`;

export const Tagline = styled.p`
  font-size: 17px;
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeInStaggered} 0.7s ease-out 0.2s forwards;
  opacity: 0;
  animation-fill-mode: forwards;
  font-weight: 400;

  .counter-value {
    font-weight: 700;
    color: ${theme.colors.primary};
    position: relative;
    display: inline-flex;
    align-items: center;
    letter-spacing: -0.3px;
    margin: 0 2px;
    
    &::after {
      content: '+';
      font-size: 16px;
      font-weight: 600;
      margin-left: 1px;
      position: relative;
      top: -5px;
    }
    
    .digit {
      display: inline-block;
      animation: ${numberFlicker} 3s ease-in-out infinite;
      font-feature-settings: "tnum";
      font-variant-numeric: tabular-nums;
    }
  }
`;

// Emergency banner container
export const EmergencyBannerContainer = styled.div`
  width: 100%;
  margin-bottom: 0;
  order: -1;
`;

// Button container styles
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  width: 100%;
  max-width: 480px;
  margin-top: ${theme.spacing.medium};
`;

export const Button = styled.button<{ variant: 'emergency' | 'regular' | 'tertiary' }>`
  width: 100%;
  height: ${props => props.variant === 'emergency' ? '80px' : '56px'};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background: ${props => {
    if (props.variant === 'emergency') {
      return `linear-gradient(135deg, #0078E7 0%, ${theme.colors.primary} 100%)`;
    } else if (props.variant === 'tertiary') {
      return 'rgba(0, 102, 204, 0.05)';
    } else {
      return 'white';
    }
  }};
  color: ${props => {
    if (props.variant === 'emergency') {
      return 'white';
    } else if (props.variant === 'tertiary') {
      return theme.colors.primary;
    } else {
      return theme.colors.primary;
    }
  }};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${props => props.variant === 'emergency' ? '22px' : '16px'};
  font-weight: ${props => props.variant === 'emergency' ? '600' : '600'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.medium};
  box-shadow: ${props => {
    if (props.variant === 'emergency') {
      return '0 6px 20px rgba(0, 102, 204, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    } else if (props.variant === 'tertiary') {
      return '0 4px 12px rgba(0, 102, 204, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
    } else {
      return '0 4px 12px rgba(0, 102, 204, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
    }
  }};
  border: ${props => {
    if (props.variant === 'emergency') {
      return 'none';
    } else if (props.variant === 'tertiary') {
      return `1.5px solid ${theme.colors.primary}`;
    } else {
      return `1.5px solid ${theme.colors.primary}`;
    }
  }};
  overflow: hidden;
  margin-top: ${props => props.variant === 'tertiary' ? theme.spacing.large : '0'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => {
      if (props.variant === 'emergency') {
        return 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)';
      } else if (props.variant === 'tertiary') {
        return 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 100%)';
      } else {
        return 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 100%)';
      }
    }};
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  
  ${props => props.variant === 'emergency' && css`
    animation: ${pulseAnimation} 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 102, 204, 0.25), 0 2px 5px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      
      &::before {
        opacity: 0.7;
      }
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1);
      
      &::before {
        opacity: 0.3;
      }
    }
  `}

  &:hover {
    transform: translateY(-2px);
    ${props => props.variant === 'regular' && css`
      background: rgba(0, 102, 204, 0.04);
      box-shadow: 0 6px 16px rgba(0, 102, 204, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
      border-color: ${theme.colors.primary};
      color: ${theme.colors.primary};
      
      &::before {
        opacity: 0.6;
      }
    `}
    ${props => props.variant === 'tertiary' && css`
      background: rgba(0, 102, 204, 0.08);
      box-shadow: 0 6px 16px rgba(0, 102, 204, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
      border-color: ${theme.colors.primary};
      
      &::before {
        opacity: 0.6;
      }
    `}
  }

  &:active {
    transform: translateY(1px);
    ${props => props.variant === 'regular' && css`
      background: rgba(0, 102, 204, 0.08);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
      border-color: ${theme.colors.primary};
      
      &::before {
        opacity: 0.3;
      }
    `}
    ${props => props.variant === 'tertiary' && css`
      background: rgba(0, 102, 204, 0.12);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
      border-color: ${theme.colors.primary};
      
      &::before {
        opacity: 0.3;
      }
    `}
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => {
      if (props.variant === 'emergency') {
        return '0 6px 20px rgba(0, 102, 204, 0.2), 0 0 0 2px rgba(0, 102, 204, 0.2)';
      } else if (props.variant === 'tertiary') {
        return '0 4px 12px rgba(0, 102, 204, 0.08), 0 0 0 2px rgba(0, 102, 204, 0.2)';
      } else {
        return '0 4px 12px rgba(0, 102, 204, 0.08), 0 0 0 2px rgba(0, 102, 204, 0.2)';
      }
    }};
  }
`;

// Button text components
export const ButtonText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

export const ButtonSubtext = styled.span`
  font-size: 14px;
  font-weight: 400;
  opacity: 0.9;
  margin-top: 4px;
`;

export const ArrowIcon = styled.span`
  margin-left: 8px;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  
  &::after {
    content: '→';
  }
`;

// Login section styles - Updated color scheme
export const ReturningUserSection = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.08);
  border: 1.5px solid ${theme.colors.primary};
  scroll-margin-top: 20vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${theme.colors.primary};
    opacity: 0.7;
  }
`;

export const ReturningUserHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${theme.spacing.small} ${theme.spacing.small};
  position: relative;
`;

export const ReturningUserTitle = styled.h3`
  font-size: ${theme.typography.fontSize.body};
  font-weight: 500;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  margin-left: ${theme.spacing.small};
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.9;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const ToggleIcon = styled.span<{ isOpen: boolean }>`
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  opacity: 0.8;
  
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const LoginSection = styled.div`
  padding-top: ${theme.spacing.medium};
  animation: ${slideUp} 0.4s ease-out;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: 0 0 ${theme.borderRadius.medium} ${theme.borderRadius.medium};
  padding: ${theme.spacing.large};
  position: relative;
  margin-top: ${theme.spacing.small};
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right,
      rgba(0, 102, 204, 0),
      rgba(0, 102, 204, 0.15),
      rgba(0, 102, 204, 0)
    );
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.medium};
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.base};
  margin-bottom: ${theme.spacing.small};
  position: relative;
  transition: transform 0.2s ease;

  &:focus-within {
    transform: translateY(-1px);
  }
`;

export const Label = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  margin-bottom: 4px;
  font-weight: 500;
  transition: color 0.2s ease;

  ${InputGroup}:focus-within & {
    color: ${theme.colors.primary};
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.medium} 0 38px;
  border: 1px solid rgba(0, 102, 204, 0.15);
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  font-family: inherit;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
  
  &:hover {
    border-color: rgba(0, 102, 204, 0.3);
    background: rgba(255, 255, 255, 0.95);
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: white;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.08);
  }

  &::placeholder {
    color: #A0AEC0;
    font-size: ${theme.typography.fontSize.small};
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  bottom: 14px;
  width: 16px;
  height: 16px;
  pointer-events: none;
  opacity: 0.6;
  transition: all 0.2s ease;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  &[data-icon="email"] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/%3E%3Cpolyline points='22,6 12,13 2,6'/%3E%3C/svg%3E");
  }

  &[data-icon="password"] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E");
  }

  ${InputGroup}:focus-within & {
    opacity: 1;
    transform: scale(1.05);
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background: linear-gradient(135deg, #0078E7 0%, ${theme.colors.primary} 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-top: ${theme.spacing.medium};
  font-size: ${theme.typography.fontSize.body};
  text-transform: none;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #0082F5 0%, #0066cc 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 102, 204, 0.25), 0 2px 5px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    &::before {
      opacity: 0.7;
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1);
    
    &::before {
      opacity: 0.3;
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 6px 20px rgba(0, 102, 204, 0.2), 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

export const ForgotPassword = styled.a`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  text-align: right;
  display: block;
  margin: -${theme.spacing.base} 0 ${theme.spacing.small};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

export const SecureLoginNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  margin-top: ${theme.spacing.medium};
  padding-top: ${theme.spacing.medium};
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(to right,
      rgba(0, 102, 204, 0),
      rgba(0, 102, 204, 0.1),
      rgba(0, 102, 204, 0)
    );
  }
`;

export const LockIcon = styled.span`
  width: 12px;
  height: 12px;
  display: inline-block;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
  margin-right: 4px;
  position: relative;
  top: 1px;
`;

// Info box styles
export const InfoBox = styled.div`
  background: rgba(0, 102, 204, 0.05);
  border-left: 3px solid ${theme.colors.primary};
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius.medium};
  margin-top: ${theme.spacing.medium};
  animation: ${fadeIn} 0.5s ease-out 0.3s backwards;
  max-width: 480px;
  width: 100%;
`;

export const InfoText = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.primary};
  line-height: 1.5;
  margin: 0;
`;

// Trust elements
export const ConsultationCounter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.small};
  width: 100%;
  max-width: 480px;
  position: relative;
  padding: ${theme.spacing.medium} ${theme.spacing.medium};
  margin: ${theme.spacing.medium} 0;
  animation: ${fadeInStaggered} 0.7s ease-out 0.4s forwards;
  opacity: 0;
  animation-fill-mode: forwards;
  
  &::before, &::after {
    content: '';
    position: absolute;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(0, 102, 204, 0), 
      rgba(0, 102, 204, 0.15), 
      rgba(0, 102, 204, 0)
    );
  }
  
  &::before {
    bottom: 0;
  }
  
  &::after {
    top: 0;
  }
`;

export const CounterLabel = styled.div`
  font-size: 15px;
  color: ${theme.colors.text.secondary};
  text-align: center;
  max-width: 95%;
  line-height: 1.5;
  font-weight: 400;
  
  strong {
    display: block;
    color: ${theme.colors.text.primary};
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 17px;
    letter-spacing: -0.2px;
    line-height: 1.3;
  }
  
  .counter-value {
    font-weight: 700;
    color: ${theme.colors.primary};
    font-size: 20px;
    position: relative;
    display: inline-flex;
    align-items: center;
    letter-spacing: -0.3px;
    margin: 0 2px;
    
    &::after {
      content: '+';
      font-size: 16px;
      font-weight: 600;
      margin-left: 1px;
      position: relative;
      top: -5px;
    }
    
    .digit {
      display: inline-block;
      animation: ${numberFlicker} 3s ease-in-out infinite;
      font-feature-settings: "tnum";
      font-variant-numeric: tabular-nums;
    }
  }
`;

// Pre-register link styles
export const PreRegisterLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${theme.spacing.medium} ${theme.spacing.small};
  margin-top: ${theme.spacing.medium};
  color: ${theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  transition: all 0.2s ease;
  letter-spacing: -0.2px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(0, 102, 204, 0), 
      rgba(0, 102, 204, 0.15), 
      rgba(0, 102, 204, 0)
    );
  }
  
  &:hover {
    color: #0078E7;
    transform: translateY(-1px);
    
    span {
      transform: translateX(3px);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const PreRegisterText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PreRegisterSubtext = styled.span`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  margin-top: 4px;
  font-weight: normal;
  letter-spacing: 0;
`;

export const PreRegisterArrow = styled.span`
  margin-left: ${theme.spacing.small};
  transition: transform 0.2s ease;
  font-size: 18px;
  color: ${theme.colors.primary};
`;

// Trust elements
export const TrustContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin-top: ${theme.spacing.xlarge};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${theme.spacing.medium};
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.8s ease-out 0.6s forwards;
  opacity: 0;
  animation-fill-mode: forwards;
`;

export const GovernmentLogo = styled.img`
  height: 48px;
  width: auto;
  opacity: 0.9;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`; 