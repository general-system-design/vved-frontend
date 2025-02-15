import { useState, useCallback } from 'react';
import { RegistrationData, initialRegistrationData } from '../types/index';
import { registrationSteps } from '../steps';

export const useRegistrationFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>(initialRegistrationData);
  const [error, setError] = useState<string | undefined>();

  const currentStep = registrationSteps[currentStepIndex];
  
  // Get all steps that should be shown together
  const getCurrentSteps = () => {
    const steps = [currentStep];
    let nextIndex = currentStepIndex + 1;
    
    while (
      nextIndex < registrationSteps.length && 
      registrationSteps[nextIndex].skipQuestion
    ) {
      steps.push(registrationSteps[nextIndex]);
      nextIndex++;
    }
    
    return steps;
  };
  
  // Update progress calculation to account for third-party registration
  const getProgress = () => {
    const totalSteps = registrationSteps.length;
    const thirdPartySteps = 4; // Number of additional steps for third-party registration
    
    if (formData.isThirdParty === 'For someone else') {
      if (currentStepIndex <= thirdPartySteps) {
        // Third-party verification phase
        return Math.round((currentStepIndex / thirdPartySteps) * 20);
      } else {
        // Regular registration phase
        const remainingProgress = 80;
        const remainingSteps = totalSteps - thirdPartySteps;
        const currentRemainingStep = currentStepIndex - thirdPartySteps;
        return 20 + Math.round((currentRemainingStep / remainingSteps) * remainingProgress);
      }
    } else {
      // Regular registration without third-party steps
      return Math.round((currentStepIndex / totalSteps) * 100);
    }
  };

  const progress = getProgress();

  const validateAnswer = useCallback((value: string, step: typeof currentStep) => {
    if (!step.validation) return undefined;
    return step.validation(value);
  }, []);

  const validateAnswers = useCallback((answers: Record<string, string>): { 
    success: boolean; 
    error?: string;
  } => {
    const steps = getCurrentSteps();
    
    // Validate all answers
    for (const step of steps) {
      const answer = answers[step.field];
      // Skip validation if the step should be skipped
      if (step.skipIf?.(formData)) continue;
      
      const error = validateAnswer(answer ?? '', step);
      if (error) {
        setError(error);
        return { success: false, error };
      }
    }

    setError(undefined);
    return { success: true };
  }, [getCurrentSteps, validateAnswer, formData]);

  const submitAnswer = useCallback((answers: Record<string, string>) => {
    // Handle address selection
    if (answers.streetAddress && answers.streetAddress.includes(',')) {
      // Parse the selected address
      const [street, rest] = answers.streetAddress.split(',');
      const [city, statePostcode] = rest.trim().split(' ');
      const state = statePostcode.slice(0, -4).trim();
      const postcode = statePostcode.slice(-4);

      // Update all address fields
      answers.streetAddress = street.trim();
      answers.suburb = city.trim();
      answers.state = state;
      answers.postcode = postcode;
    }

    // Update form data with all answers
    const newFormData = {
      ...formData,
      ...answers
    };
    setFormData(newFormData);

    // Find next non-skipped step
    let nextStepIndex = currentStepIndex + getCurrentSteps().length;
    while (
      nextStepIndex < registrationSteps.length && 
      registrationSteps[nextStepIndex].skipIf?.(newFormData)
    ) {
      nextStepIndex++;
    }

    if (nextStepIndex < registrationSteps.length) {
      setCurrentStepIndex(nextStepIndex);
    }
  }, [currentStepIndex, formData, getCurrentSteps]);

  const handleAnswer = useCallback((answers: Record<string, string>): { 
    success: boolean; 
    error?: string;
  } => {
    const validationResult = validateAnswers(answers);
    if (validationResult.success) {
      submitAnswer(answers);
    }
    return validationResult;
  }, [validateAnswers, submitAnswer]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      // Find previous non-skipped step
      let prevStepIndex = currentStepIndex - 1;
      while (prevStepIndex > 0 && registrationSteps[prevStepIndex].skipQuestion) {
        prevStepIndex--;
      }
      setCurrentStepIndex(prevStepIndex);
      setError(undefined);
    }
  }, [currentStepIndex]);

  const resetForm = useCallback(() => {
    setCurrentStepIndex(0);
    setFormData(initialRegistrationData);
    setError(undefined);
  }, []);

  return {
    currentStep,
    currentSteps: getCurrentSteps(),
    formData,
    error,
    progress,
    handleAnswer,
    validateAnswers,
    submitAnswer,
    goBack,
    isComplete: currentStepIndex === registrationSteps.length - 1,
    resetForm
  };
}; 