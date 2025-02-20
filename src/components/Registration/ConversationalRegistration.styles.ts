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

export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideOutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
`;

export const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const selectDropdownAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Mixins
export const focusRing = `
  outline: none;
  box-shadow: 0 0 0 3px ${theme.colors.surface}, 0 0 0 5px rgba(0, 102, 204, 0.25);
  border-color: ${theme.colors.primary};
`;

export const errorRing = `
  box-shadow: 0 0 0 3px ${theme.colors.surface}, 0 0 0 5px rgba(220, 38, 38, 0.15);
  border-color: ${theme.colors.emergency};
`;

// Layout Components
export const Container = styled.div<{ isEmergency?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  background: ${theme.colors.surface};
  min-height: 100vh;
  position: relative;
  padding-bottom: ${props => props.isEmergency ? '160px' : '80px'};
  overflow: hidden;
`;

export const FormContainer = styled.div<{ isEmergency?: boolean }>`
  padding: ${theme.spacing.medium};
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  position: relative;
  min-height: calc(100vh - 160px);
  padding-bottom: ${props => props.isEmergency ? '80px' : '0'};
`;

export const QuestionWrapper = styled.div`
  width: 100%;
  position: relative;
  min-height: 200px;
  height: auto;
  margin-top: ${theme.spacing.large};
`;

export const QuestionContainer = styled.div<{ isExiting?: boolean }>`
  background: white;
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.large};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
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

// Question and Text Components
export const Question = styled.div`
  font-size: ${theme.typography.fontSize.h2};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.large};
  font-family: ${theme.typography.fontFamily.header};
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: -0.3px;
  animation: ${fadeInScale} 0.4s ease-out;
  position: sticky;
  top: 0;
  background: white;
  padding: ${theme.spacing.medium} 0;
  z-index: 1;
  border-bottom: 1px solid ${theme.colors.text.disabled};
`;

export const HelpText = styled.div`
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

// Date Input specific components
export const DateFieldsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.small};
`;

export const DateFieldWrapper = styled.div`
  flex: 1;
  min-width: 0; // Prevents flex items from overflowing
`;

// Input Components
export const InputWrapper = styled.div<{ layout?: string }>`
  margin-bottom: ${theme.spacing.medium};
  ${props => props.layout?.startsWith('inline') && `
    flex: 1;
    min-width: 0;
  `}
`;

export const InputLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.small};
  font-weight: 500;
`;

interface InputProps {
  hasError?: boolean;
  $isDateField?: boolean;
  $isTextarea?: boolean;
}

export const Input = styled.input<InputProps>`
  width: 100%;
  height: ${props => props.$isTextarea ? 'auto' : '56px'};
  min-height: ${props => props.$isTextarea ? '72px' : 'auto'};
  padding: ${props => props.$isTextarea 
    ? theme.spacing.medium 
    : `0 ${props.$isDateField ? theme.spacing.small : theme.spacing.large}`};
  border: 1.5px solid ${props => 
    props.hasError ? theme.colors.emergency : 
    theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  font-family: inherit;
  line-height: 1.5;
  background: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: ${props => props.$isDateField ? 'center' : 'left'};
  resize: ${props => props.$isTextarea ? 'none' : 'initial'};
  overflow: ${props => props.$isTextarea ? 'hidden' : 'initial'};
  
  &:hover {
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : 
      theme.colors.text.primary};
    background: white;
  }
  
  &:focus {
    ${props => props.hasError ? errorRing : focusRing}
    background: white;
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
    transition: color 0.2s ease;
    font-size: ${theme.typography.fontSize.small};
  }

  &:focus::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

export const Select = styled.select<{ hasError?: boolean }>`
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%232C3E50' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.large} center;
  padding-right: ${theme.spacing.xlarge};
  
  &:hover {
    border-color: ${props => 
      props.hasError ? theme.colors.emergency : 
      theme.colors.text.primary};
  }
  
  &:focus {
    ${props => props.hasError ? errorRing : focusRing}
  }

  & option {
    animation: ${selectDropdownAnimation} 0.2s ease-out;
  }
`;

// Location Components
export const AddressInputGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.small};
  align-items: flex-start;
`;

export const LocationButton = styled.button<{ isLoading?: boolean }>`
  height: 56px;
  min-width: 56px;
  padding: 0;
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  background: white;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.surface};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${theme.colors.text.disabled};
  }

  svg {
    width: 24px;
    height: 24px;
    ${props => props.isLoading && `
      animation: spin 1s linear infinite;
    `}
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Address Autocomplete Components
export const AddressAutocomplete = styled.div`
  position: relative;
  width: 100%;
`;

export const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

export const SuggestionItem = styled.li`
  padding: ${theme.spacing.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.surface};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.text.disabled};
  }
`;

// Radio Components
export const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.medium};
`;

export const RadioLabel = styled.label`
  flex: 1;
  position: relative;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;

  &:focus + span {
    ${focusRing}
  }

  &:checked + span {
    background: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
  }
`;

export const RadioButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 ${theme.spacing.large};
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  background: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.surface};
  }
`;

// Navigation Components
export const NavigationContainer = styled.div<{ isEmergency?: boolean }>`
  position: fixed;
  bottom: ${props => props.isEmergency ? '80px' : '0'};
  left: 0;
  right: 0;
  background: white;
  z-index: 11;
  width: 100%;
`;

export const ButtonContainer = styled.div<{ isEmergency?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background: white;
  border-top: 1px solid ${theme.colors.text.disabled};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

// Button Components
export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
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

// Welcome Screen Components
export const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  padding: ${theme.spacing.medium};
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  background: transparent;
`;

export const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: 28px;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.small};
  line-height: 1.2;
  font-weight: 600;
  
  &::before {
    content: '⚕';
    color: ${theme.colors.primary};
    font-size: 28px;
    display: block;
    margin-bottom: ${theme.spacing.small};
  }
`;

export const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.medium};
  line-height: 1.4;
  padding: 0 ${theme.spacing.medium};
`;

export const MedicareNotice = styled.div`
  width: 100%;
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.body};
  margin: ${theme.spacing.small} 0;
  padding: ${theme.spacing.large};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.medium};
  text-align: left;
  line-height: 1.4;
  border: 1px solid rgba(0, 102, 204, 0.1);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.05);
`;

export const MedicareText = styled.div`
  width: 100%;
`;

export const MedicareTitle = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.body};
  margin-bottom: ${theme.spacing.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};

  & > svg {
    width: 20px;
    height: 20px;
    color: #2D9D3A; // Medicare green
  }
`;

export const MedicareDescription = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.medium};

  & > div {
    padding: ${theme.spacing.medium};
    background: white;
    border-radius: ${theme.borderRadius.small};
    border: 1px solid rgba(0, 102, 204, 0.1);
    transition: all 0.2s ease;

    &:first-child {
      background: ${theme.colors.surface};
      border: 1px solid ${theme.colors.primary};
      box-shadow: 0 2px 12px rgba(0, 102, 204, 0.08);
      position: relative;
      overflow: hidden;

      &::before {
        content: 'Recommended';
        position: absolute;
        top: 0;
        right: 0;
        background: ${theme.colors.primary};
        color: white;
        font-size: 12px;
        padding: 4px 8px;
        border-bottom-left-radius: ${theme.borderRadius.small};
        font-weight: 500;
      }

      & h3 {
        color: ${theme.colors.primary};
        font-size: ${theme.typography.fontSize.body};
        font-weight: 600;
      }

      & svg {
        color: ${theme.colors.primary};
        opacity: 1;
      }

      & li {
        color: ${theme.colors.text.primary};
        font-weight: 500;
      }
    }
  }

  & h3 {
    color: ${theme.colors.text.secondary};
    font-weight: 500;
    margin-bottom: ${theme.spacing.small};
    font-size: ${theme.typography.fontSize.small};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.small};
  }

  & ul {
    margin: 0;
    padding: 0;
    list-style: none;
    color: ${theme.colors.text.secondary};
  }

  & li {
    margin-bottom: ${theme.spacing.small};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.small};
    font-size: ${theme.typography.fontSize.small};

    & > svg {
      width: 16px;
      height: 16px;
      color: ${theme.colors.text.secondary};
      opacity: 0.8;
      flex-shrink: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const MedicareActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
  width: 100%;
  margin-top: ${theme.spacing.large};
`;

export const MedicareButton = styled(Button)<{ variant?: 'primary' | 'secondary' | 'text' }>`
  width: 100%;
  height: 48px;
  font-size: ${theme.typography.fontSize.small};
  font-weight: 500;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' && `
    background: ${theme.colors.primary};
    font-weight: 600;
    height: 56px;
    font-size: ${theme.typography.fontSize.body};
    box-shadow: 0 2px 12px rgba(0, 102, 204, 0.15);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 102, 204, 0.2);
      background: linear-gradient(135deg, ${theme.colors.primary}, color-mix(in srgb, ${theme.colors.primary} 85%, #2D9D3A));
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: white;
    border: 1.5px solid ${theme.colors.text.disabled};
    color: ${theme.colors.text.primary};
    
    &:hover {
      border-color: ${theme.colors.primary};
      color: ${theme.colors.primary};
      background: rgba(0, 102, 204, 0.03);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
      background: rgba(0, 102, 204, 0.05);
    }
  `}

  ${props => props.variant === 'text' && `
    background: transparent;
    border: none;
    color: ${theme.colors.text.secondary};
    height: 40px;
    font-size: ${theme.typography.fontSize.small};
    padding: 0 ${theme.spacing.small};
    
    &:hover {
      background: rgba(0, 0, 0, 0.03);
      text-decoration: none;
      box-shadow: none;
      transform: none;
      color: ${theme.colors.text.primary};
    }

    &:active {
      background: rgba(0, 0, 0, 0.05);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const StartButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: ${theme.typography.fontSize.body};
  background: ${theme.colors.primary};
  border: none;
  margin: ${theme.spacing.medium};
  text-transform: uppercase;
  box-shadow: none;

  &:hover {
    box-shadow: none;
    filter: brightness(1.1);
  }
`;

export const EstimatedTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.small};
`;

export const TimeIcon = styled.span`
  font-size: 16px;
  color: ${theme.colors.text.secondary};
`;

// Error Message Component
export const ErrorMessage = styled.div`
  color: ${theme.colors.emergency};
  font-size: ${theme.typography.fontSize.small};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.medium};
  background: ${`rgba(${theme.colors.emergency}, 0.05)`};
  border-radius: ${theme.borderRadius.medium};
  animation: ${fadeInScale} 0.3s ease-out;
  margin-bottom: ${theme.spacing.medium};

  &::before {
    content: '⚠';
  }
`; 