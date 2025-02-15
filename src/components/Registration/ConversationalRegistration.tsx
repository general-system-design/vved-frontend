import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../Layout/PageLayout';
import { useRegistrationFlow } from './hooks/useRegistrationFlow';
import { RegistrationStep, RegistrationData } from './types/index';
import { EmergencyBanner } from '../shared/EmergencyBanner';
import { Header } from '../shared/Header';
import { useMapbox } from '../../hooks/useMapbox';
import { LocationMap } from './LocationMap';

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

const selectDropdownAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const focusRing = `
  outline: none;
  box-shadow: 0 0 0 3px ${theme.colors.surface}, 0 0 0 5px rgba(0, 102, 204, 0.25);
  border-color: ${theme.colors.primary};
`;

const errorRing = `
  box-shadow: 0 0 0 3px ${theme.colors.surface}, 0 0 0 5px rgba(220, 38, 38, 0.15);
  border-color: ${theme.colors.emergency};
`;

interface ContainerProps {
  isEmergency?: boolean;
}

const Container = styled.div<ContainerProps>`
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

const FormContainer = styled.div<ContainerProps>`
  padding: ${theme.spacing.medium};
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  position: relative;
  min-height: calc(100vh - 160px);
  padding-bottom: ${props => props.isEmergency ? '80px' : '0'};
`;

const QuestionWrapper = styled.div`
  width: 100%;
  position: relative;
  min-height: 200px;
  height: auto;
  margin-top: ${theme.spacing.large};
`;

const QuestionContainer = styled.div<{ isExiting?: boolean }>`
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

const Question = styled.div`
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

const InputWrapper = styled.div`
  margin-bottom: ${theme.spacing.medium};
`;

const AddressInputGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.small};
  align-items: flex-start;
`;

const LocationButton = styled.button<{ isLoading?: boolean }>`
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

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
      fill="currentColor"/>
  </svg>
);

const LoadingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" 
      fill="currentColor" opacity="0.3"/>
    <path d="M12 4V2c5.52 0 10 4.48 10 10h-2c0-4.42-3.58-8-8-8z" 
      fill="currentColor"/>
  </svg>
);

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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
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
  }

  &:focus::placeholder {
    color: ${theme.colors.text.secondary};
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

  &:not([multiple]):not([size]) {
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%232C3E50' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-position: right ${theme.spacing.large} center;
    background-repeat: no-repeat;
    padding-right: ${theme.spacing.xlarge};
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
  width: 100%;
`;

const ButtonContainer = styled.div<{ isEmergency?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background: white;
  border-top: 1px solid ${theme.colors.text.disabled};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
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
  padding: ${theme.spacing.medium};
  background: ${`rgba(${theme.colors.emergency}, 0.05)`};
  border-radius: ${theme.borderRadius.medium};
  animation: ${fadeInScale} 0.3s ease-out;

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

const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.medium};
`;

const RadioLabel = styled.label`
  flex: 1;
  position: relative;
  cursor: pointer;
`;

const RadioInput = styled.input`
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

const RadioButton = styled.span`
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

const AddressAutocomplete = styled.div`
  position: relative;
  width: 100%;
`;

const SuggestionsList = styled.ul`
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

const SuggestionItem = styled.li`
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

export const ConversationalRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentInputs, setCurrentInputs] = useState<Partial<RegistrationData>>({});
  const isEmergency = searchParams.get('type') === 'emergency';
  const [isExiting, setIsExiting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextStepQueued, setNextStepQueued] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>();
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    currentStep,
    currentSteps,
    formData,
    error,
    progress,
    validateAnswers,
    submitAnswer,
    goBack,
    isComplete,
  } = useRegistrationFlow();

  const { getAddressFromCoordinates, searchAddress, isLoading: isMapboxLoading } = useMapbox();

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    return new Promise<void>(resolve => {
      setCurrentInputs(prev => ({
        ...prev,
        [field]: value
      }));
      // Use requestAnimationFrame to ensure state is updated
      requestAnimationFrame(() => resolve());
    });
  };

  const handleTransition = async (answer: Record<string, string>) => {
    // Wait 100ms before starting the animation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setIsTransitioning(true);
    setIsExiting(true);
    
    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Now that the animation is complete, hide the current question
    setNextStepQueued(true);
    
    // Update form data
    submitAnswer(answer);
    
    // Clear inputs
    setCurrentInputs({});
    
    // Small delay before removing exit state and showing next question
    setTimeout(() => {
      setIsExiting(false);
      setIsTransitioning(false);
      setNextStepQueued(false);
    }, 50);
  };

  const handleContinue = async () => {
    if (isTransitioning) return;

    // Prepare the answer
    const fieldsToSubmit = currentSteps.map(step => step.field) as Array<keyof RegistrationData>;
    const answer = fieldsToSubmit.reduce((acc, field) => ({
      ...acc,
      [field]: currentInputs[field]?.toString() || formData[field]?.toString() || ''
    }), {} as Record<string, string>);

    // Try to submit the answer
    const result = validateAnswers(answer);
    
    if (result.success) {
      await handleTransition(answer);
    }
  };

  const handleSelectChange = async (field: keyof RegistrationData, value: string, step: RegistrationStep) => {
    if (isTransitioning || !value) return;
    
    // First validate the value
    const error = step.validation?.(value);
    if (error) {
      return;
    }

    // Set the input value
    await handleInputChange(field, value);
    
    // Special handling for isCurrentLocationDifferent
    if (field === 'isCurrentLocationDifferent') {
      // Don't auto-progress, just update the value and clear location data if needed
      if (value === 'false') {
        setCurrentInputs(prev => ({
          ...prev,
          currentStreetAddress: '',
          currentSuburb: '',
          currentState: '',
          currentPostcode: ''
        }));
      }
      return;
    }
    
    // Only auto-progress for non-address fields
    const addressFields = ['streetAddress', 'suburb', 'state', 'postcode', 'currentStreetAddress', 'currentSuburb', 'currentState', 'currentPostcode'];
    if (!addressFields.includes(field)) {
      // Prepare and validate the complete answer
      const fieldsToSubmit = currentSteps.map(s => s.field);
      const answer = fieldsToSubmit.reduce((acc, f) => ({
        ...acc,
        [f]: f === field ? value : (currentInputs[f as keyof RegistrationData]?.toString() || formData[f as keyof RegistrationData]?.toString() || '')
      }), {} as Record<string, string>);

      // Validate the answer without submitting it yet
      const result = validateAnswers(answer);
      
      if (result.success) {
        await handleTransition(answer);
      }
    }
  };

  const handleLocationConfirmed = async (address: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }) => {
    // Set all current location fields
    const answers: Record<string, string> = {
      currentStreetAddress: address.streetAddress,
      currentSuburb: address.suburb,
      currentState: address.state,
      currentPostcode: address.postcode
    };

    // Update the current inputs
    setCurrentInputs(prev => ({
      ...prev,
      ...answers
    }));

    // If this is the residential address question, also update those fields
    if (currentStep.field === 'streetAddress') {
      setCurrentInputs(prev => ({
        ...prev,
        streetAddress: address.streetAddress,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode
      }));
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000
        };
        
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const { latitude, longitude } = position.coords;
      
      try {
        const address = await getAddressFromCoordinates(latitude, longitude);
        
        // Determine which fields to update based on current step
        if (currentStep.field.startsWith('current')) {
          setCurrentInputs(prev => ({
            ...prev,
            currentStreetAddress: address.streetAddress,
            currentSuburb: address.suburb,
            currentState: address.state,
            currentPostcode: address.postcode
          }));
        } else {
          setCurrentInputs(prev => ({
            ...prev,
            streetAddress: address.streetAddress,
            suburb: address.suburb,
            state: address.state,
            postcode: address.postcode
          }));
        }
        
        setLocationError(undefined);
      } catch (error) {
        console.error('Failed to get address:', error);
        setLocationError("Unable to retrieve your location. Please enter it manually.");
      }
    } catch (error) {
      let errorMessage = "Unable to retrieve your location. Please enter it manually.";
      if (error instanceof GeolocationPositionError) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location access or enter your address manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter your address manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please try again or enter your address manually.";
            break;
        }
      }
      setLocationError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAddressSearch = async (query: string) => {
    if (!query.trim()) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const suggestions = await searchAddress(query);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to search addresses:', error);
    }
  };

  const handleAddressSelect = (address: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }) => {
    const isCurrentLocation = currentStep.field.startsWith('current');
    const prefix = isCurrentLocation ? 'current' : '';
    
    setCurrentInputs(prev => ({
      ...prev,
      [`${prefix}streetAddress`]: address.streetAddress,
      [`${prefix}suburb`]: address.suburb,
      [`${prefix}state`]: address.state,
      [`${prefix}postcode`]: address.postcode
    }));

    setShowSuggestions(false);
  };

  const renderInput = (step: RegistrationStep) => {
    const value = currentInputs[step.field]?.toString() || formData[step.field]?.toString() || '';
    const hasError = !!error;

    // Special handling for current location map
    if (step.field === 'currentStreetAddress' && formData.isCurrentLocationDifferent) {
      return (
        <>
          <LocationMap onLocationConfirmed={handleLocationConfirmed} />
          <InputWrapper>
            <InputLabel>{step.placeholder}</InputLabel>
            <AddressInputGroup>
              <AddressAutocomplete>
                <Input
                  type={step.type}
                  value={value}
                  onChange={(e) => {
                    handleInputChange(step.field, e.target.value);
                    handleAddressSearch(e.target.value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && handleContinue()}
                  placeholder={step.placeholder}
                  pattern={step.pattern}
                  hasError={hasError}
                  disabled={isTransitioning}
                  style={{ flex: 1 }}
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <SuggestionsList>
                    {addressSuggestions.map((suggestion, index) => (
                      <SuggestionItem
                        key={index}
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        {suggestion.streetAddress}, {suggestion.suburb} {suggestion.state} {suggestion.postcode}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </AddressAutocomplete>
              <LocationButton
                onClick={handleGetLocation}
                disabled={isTransitioning || isLoadingLocation || isMapboxLoading}
                isLoading={isLoadingLocation || isMapboxLoading}
                type="button"
                title="Use my current location"
                aria-label="Use my current location"
              >
                {(isLoadingLocation || isMapboxLoading) ? <LoadingIcon /> : <LocationIcon />}
              </LocationButton>
            </AddressInputGroup>
            {locationError && <ErrorMessage>{locationError}</ErrorMessage>}
          </InputWrapper>
        </>
      );
    }

    switch (step.type) {
      case 'select':
        return (
          <InputWrapper>
            <InputLabel>{step.placeholder || 'Select an option'}</InputLabel>
            <Select
              value={value}
              onChange={async (e) => {
                const newValue = e.target.value;
                await handleSelectChange(step.field, newValue, step);
              }}
              hasError={hasError}
              disabled={isTransitioning}
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
      case 'radio':
        return (
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name={step.field}
                value="true"
                checked={value === 'true'}
                onChange={() => {
                  if (isTransitioning) return;
                  handleSelectChange(step.field, 'true', step);
                }}
                disabled={isTransitioning}
              />
              <RadioButton>Yes</RadioButton>
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name={step.field}
                value="false"
                checked={value === 'false'}
                onChange={() => {
                  if (isTransitioning) return;
                  handleSelectChange(step.field, 'false', step);
                }}
                disabled={isTransitioning}
              />
              <RadioButton>No</RadioButton>
            </RadioLabel>
          </RadioGroup>
        );
      case 'boolean':
        const boolValue = value === 'true' ? true : value === 'false' ? false : undefined;
        return (
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name={step.field}
                value="true"
                checked={boolValue === true}
                onChange={() => {
                  if (isTransitioning) return;
                  handleInputChange(step.field, 'true');
                  handleContinue();
                }}
                disabled={isTransitioning}
              />
              <RadioButton>Yes</RadioButton>
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name={step.field}
                value="false"
                checked={boolValue === false}
                onChange={() => {
                  if (isTransitioning) return;
                  handleInputChange(step.field, 'false');
                  handleContinue();
                }}
                disabled={isTransitioning}
              />
              <RadioButton>No</RadioButton>
            </RadioLabel>
          </RadioGroup>
        );
      default:
        // Special handling for street address to add location button
        if (step.field === 'streetAddress') {
          return (
            <InputWrapper>
              <InputLabel>{step.placeholder}</InputLabel>
              <AddressInputGroup>
                <AddressAutocomplete>
                  <Input
                    type={step.type}
                    value={value}
                    onChange={(e) => {
                      handleInputChange(step.field, e.target.value);
                      handleAddressSearch(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && handleContinue()}
                    placeholder={step.placeholder}
                    pattern={step.pattern}
                    hasError={hasError}
                    disabled={isTransitioning}
                    style={{ flex: 1 }}
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <SuggestionsList>
                      {addressSuggestions.map((suggestion, index) => (
                        <SuggestionItem
                          key={index}
                          onClick={() => handleAddressSelect(suggestion)}
                        >
                          {suggestion.streetAddress}, {suggestion.suburb} {suggestion.state} {suggestion.postcode}
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </AddressAutocomplete>
                <LocationButton
                  onClick={handleGetLocation}
                  disabled={isTransitioning || isLoadingLocation || isMapboxLoading}
                  isLoading={isLoadingLocation || isMapboxLoading}
                  type="button"
                  title="Use my current location"
                  aria-label="Use my current location"
                >
                  {(isLoadingLocation || isMapboxLoading) ? <LoadingIcon /> : <LocationIcon />}
                </LocationButton>
              </AddressInputGroup>
              {locationError && <ErrorMessage>{locationError}</ErrorMessage>}
            </InputWrapper>
          );
        }

        return (
          <InputWrapper>
            <InputLabel>{step.placeholder}</InputLabel>
            <Input
              type={step.type}
              value={value}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && handleContinue()}
              placeholder={step.placeholder}
              pattern={step.pattern}
              hasError={hasError}
              disabled={isTransitioning}
            />
          </InputWrapper>
        );
    }
  };

  const startRegistration = () => {
    setShowWelcome(false);
  };

  const shouldShowContinueButton = (step: RegistrationStep) => {
    // If step explicitly defines shouldShowContinue, use that
    if (typeof step.shouldShowContinue !== 'undefined') {
      return step.shouldShowContinue;
    }
    
    // Show continue button for radio type questions
    if (step.type === 'radio') return true;
    // Hide continue button for select type questions as they auto-progress
    if (step.type === 'select') return false;
    // Hide continue button for boolean type questions as they auto-progress
    if (step.type === 'boolean') return false;
    return true;
  };

  const hasValidInput = () => {
    return currentSteps.every(step => {
      const field = step.field as keyof RegistrationData;
      const value = currentInputs[field]?.toString() || formData[field]?.toString() || '';
      return value.trim() !== '';
    });
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
              ? "We'll now collect some details to help us prepare for your consultation."
              : "Let's get you registered for your visit."}
          </Subtitle>
          <StartButton onClick={startRegistration}>
            I'm ready to register
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

  const currentHelpText = typeof currentStep.helpText === 'function'
    ? currentStep.helpText(formData)
    : currentStep.helpText;

  return (
    <PageLayout 
      showBack
      onBack={goBack}
    >
      <Container isEmergency={isEmergency}>
        <Header showLogo title="Virtual Emergency Department" />

        <FormContainer isEmergency={isEmergency}>
          <QuestionWrapper>
            <QuestionContainer isExiting={isExiting}>
              {!nextStepQueued && currentSteps.map((step, index) => (
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
              {currentHelpText && !nextStepQueued && <HelpText>{currentHelpText}</HelpText>}
              {error && !nextStepQueued && <ErrorMessage>{error}</ErrorMessage>}
            </QuestionContainer>
          </QuestionWrapper>
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
            {shouldShowContinueButton(currentStep) && (
              <Button 
                onClick={handleContinue}
                disabled={!hasValidInput() || isTransitioning}
              >
                Continue →
              </Button>
            )}
          </ButtonContainer>
        </NavigationContainer>

        {isEmergency && <EmergencyBanner />}
      </Container>
    </PageLayout>
  );
}; 