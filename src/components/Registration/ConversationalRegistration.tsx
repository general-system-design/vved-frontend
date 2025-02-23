import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../Layout/PageLayout';
import { useRegistrationFlow } from './hooks/useRegistrationFlow';
import type { RegistrationData } from './types/index';
import { EmergencyBanner } from '../shared/EmergencyBanner';
import { Header } from '../shared/Header';
import { useMapbox } from '../../hooks/useMapbox';
import { Container, FormContainer } from './ConversationalRegistration.styles';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionForm } from './components/QuestionForm';
import { Navigation } from './components/Navigation';
import { MedicareForm } from './components/Medicare/MedicareForm';

export const ConversationalRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentInputs, setCurrentInputs] = useState<Partial<RegistrationData>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
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
    setFormData,
  } = useRegistrationFlow();

  const { getAddressFromCoordinates, searchAddress, isLoading: isMapboxLoading } = useMapbox();

  const handleInputChange = async (field: keyof RegistrationData, value: string) => {
    console.group('handleInputChange');
    console.log('Field:', field);
    console.log('Value:', value);
    console.log('Current form data:', formData);
    console.log('Current inputs:', currentInputs);
    
    setCurrentInputs(prev => {
      const newInputs = {
        ...prev,
        [field]: value
      };
      console.log('New inputs:', newInputs);
      return newInputs;
    });

    // For select fields that are part of a multi-field step, don't auto-progress
    const isMultiFieldStep = currentSteps.length > 1;
    if (currentStep.type === 'select' && !isMultiFieldStep) {
      const answer = {
        [field]: value
      };

      const result = validateAnswers(answer);
      if (result.success) {
        await handleTransition(answer);
      }
    }
    console.groupEnd();
  };

  const handleTransition = async (answer: Record<string, string>) => {
    console.group('handleTransition');
    console.log('Starting transition with answer:', answer);
    console.log('Current form data:', formData);
    console.log('Current inputs:', currentInputs);
    
    setIsTransitioning(true);
    setIsExiting(true);
    setHasInteracted(false);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    React.startTransition(() => {
      setNextStepQueued(true);
      submitAnswer(answer);
      setCurrentInputs({});
    });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    React.startTransition(() => {
      setIsExiting(false);
      setIsTransitioning(false);
      setNextStepQueued(false);
    });
    
    console.log('After transition - form data:', formData);
    console.groupEnd();
  };

  const handleContinue = async () => {
    if (isTransitioning) return;

    setHasInteracted(true);

    // Enhanced logging for debugging
    console.group('Form Submission');
    console.log('Current step:', currentStep);
    console.log('Current inputs:', currentInputs);
    console.log('Form data:', formData);

    let answer: Record<string, string> = {};

    if (currentStep.type === 'custom' && currentStep.component === MedicareForm) {
      // Handle Medicare form fields
      answer = {
        medicareNumber: currentInputs.medicareNumber?.toString() || formData.medicareNumber?.toString() || '',
        medicareIRN: currentInputs.medicareIRN?.toString() || formData.medicareIRN?.toString() || '',
        medicareExpiry: currentInputs.medicareExpiry?.toString() || formData.medicareExpiry?.toString() || ''
      };
    } else {
      // Handle all other steps, including multifield steps
      currentSteps.forEach(step => {
        if (step.type === 'multifield' && step.fields) {
          // For multifield steps, include all fields from the fields array
          step.fields.forEach(field => {
            const fieldValue = currentInputs[field.field]?.toString() || formData[field.field]?.toString() || '';
            answer[field.field] = fieldValue;
          });
        } else {
          // For regular steps, just include the main field
          answer[step.field] = currentInputs[step.field]?.toString() || formData[step.field]?.toString() || '';
        }
      });
    }

    console.log('Submitting answers:', answer);
    console.groupEnd();

    const result = validateAnswers(answer);
    if (result.success) {
      await handleTransition(answer);
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
    } as Partial<RegistrationData>));

    setShowSuggestions(false);
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

  const handleClearLocationData = () => {
    setCurrentInputs(prev => ({
      ...prev,
      currentStreetAddress: '',
      currentSuburb: '',
      currentState: '',
      currentPostcode: ''
    }));
  };

  const startRegistration = (medicareChoice: 'with-medicare' | 'without-medicare' | 'not-eligible') => {
    setShowWelcome(false);
    
    // Store Medicare choice in formData without advancing the step
    setFormData((prev: RegistrationData) => ({
      ...prev,
      medicareChoice,
      hasMedicareCard: medicareChoice === 'with-medicare' ? 'Yes' : 'No'
    }));
    
    // Start with empty currentInputs to show the registration type question
    setCurrentInputs({});
  };

  const shouldShowContinueButton = () => {
    // If step explicitly defines shouldShowContinue, use that
    if (typeof currentStep.shouldShowContinue !== 'undefined') {
      return currentStep.shouldShowContinue;
    }
    
    // Always show continue for multi-field steps
    if (currentSteps.length > 1) return true;
    
    // Show continue button for radio type questions
    if (currentStep.type === 'radio') return true;
    // Hide continue button for select questions (unless multi-field)
    if (currentStep.type === 'select') return false;
    // Hide continue button for boolean questions
    if (currentStep.type === 'boolean') return false;
    return true;
  };

  const hasValidInput = () => {
    // For multi-field steps, all fields must be filled
    return currentSteps.every(step => {
      const value = currentInputs[step.field]?.toString() || formData[step.field]?.toString() || '';
      return value.trim() !== '';
    });
  };

  // Add logging for error and hasInteracted state changes
  React.useEffect(() => {
    console.log('State changed - error:', error, 'hasInteracted:', hasInteracted, 'currentStep:', currentStep);
  }, [error, hasInteracted, currentStep]);

  // Handle navigation to confirmation screen
  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        navigate('/confirmation', {
          state: {
            registrationData: formData,
            type: searchParams.get('type')
          }
        });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isComplete, formData, navigate, searchParams]);

  if (showWelcome) {
    return (
      <PageLayout progress={0}>
        <WelcomeScreen 
          isEmergency={isEmergency}
          onStart={startRegistration}
        />
      </PageLayout>
    );
  }

  if (isComplete) {
    return null;
  }

  return (
    <PageLayout 
      showBack
      onBack={goBack}
    >
      <Container isEmergency={isEmergency}>
        <Header showLogo title="Virtual Emergency Department" />
        <FormContainer isEmergency={isEmergency}>
          <QuestionForm
            currentStep={currentStep}
            currentSteps={currentSteps}
            formData={formData}
            currentInputs={currentInputs}
            error={hasInteracted ? error : undefined}
            isExiting={isExiting}
            isTransitioning={isTransitioning}
            nextStepQueued={nextStepQueued}
            isLoadingLocation={isLoadingLocation}
            isMapboxLoading={isMapboxLoading}
            locationError={locationError}
            showSuggestions={showSuggestions}
            addressSuggestions={addressSuggestions}
            onInputChange={handleInputChange}
            onLocationConfirmed={handleLocationConfirmed}
            onGetLocation={handleGetLocation}
            onAddressSelect={handleAddressSelect}
            onAddressSearch={handleAddressSearch}
            onContinue={handleContinue}
            onClearLocationData={handleClearLocationData}
          />
        </FormContainer>

        <Navigation
          isEmergency={isEmergency}
          showBack={!!progress}
          onBack={goBack}
          onContinue={handleContinue}
          showContinue={shouldShowContinueButton()}
          disableContinue={!hasValidInput()}
          isTransitioning={isTransitioning}
        />

        {isEmergency && <EmergencyBanner />}
      </Container>
    </PageLayout>
  );
}; 