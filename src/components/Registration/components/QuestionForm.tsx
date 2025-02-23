import React from 'react';
import { LocationMap } from '../LocationMap';
import { LocationIcon, LoadingIcon } from './Icons';
import { ProgressIndicator } from './ProgressIndicator';
import { useRegistrationProgress } from '../hooks/useRegistrationProgress';
import type { RegistrationStep, RegistrationData } from '../types/index';
import {
  QuestionWrapper,
  QuestionContainer,
  Question,
  InputWrapper,
  InputLabel,
  Input,
  Select,
  AddressInputGroup,
  LocationButton,
  AddressAutocomplete,
  SuggestionsList,
  SuggestionItem,
  RadioGroup,
  RadioLabel,
  RadioInput,
  RadioButton,
  HelpText,
  ErrorMessage,
  DateFieldsContainer,
  DateFieldWrapper
} from '../ConversationalRegistration.styles';

interface QuestionFormProps {
  currentStep: RegistrationStep;
  currentSteps: RegistrationStep[];
  formData: RegistrationData;
  currentInputs: Partial<RegistrationData>;
  error?: string;
  isExiting: boolean;
  isTransitioning: boolean;
  nextStepQueued: boolean;
  isLoadingLocation: boolean;
  isMapboxLoading: boolean;
  locationError?: string;
  showSuggestions: boolean;
  addressSuggestions: Array<{
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }>;
  onInputChange: (field: keyof RegistrationData & string, value: string) => Promise<void>;
  onLocationConfirmed: (address: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }) => void;
  onGetLocation: () => void;
  onAddressSelect: (address: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  }) => void;
  onAddressSearch: (query: string) => void;
  onContinue: () => void;
  onClearLocationData: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  currentStep,
  currentSteps,
  formData,
  currentInputs,
  error,
  isExiting,
  isTransitioning,
  nextStepQueued,
  isLoadingLocation,
  isMapboxLoading,
  locationError,
  showSuggestions,
  addressSuggestions,
  onInputChange,
  onLocationConfirmed,
  onGetLocation,
  onAddressSelect,
  onAddressSearch,
  onContinue,
  onClearLocationData
}) => {
  const monthInputRef = React.useRef<HTMLInputElement>(null);
  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const progressInfo = useRegistrationProgress(currentStep);

  const handleSelectChange = async (field: string, value: string) => {
    // Always prevent changes during transitions
    if (isTransitioning) return;
    
    // During normal operation, prevent empty values from triggering changes
    if (!value && !isTransitioning) return;
    
    // Set the input value
    await onInputChange(field as keyof RegistrationData & string, value);
    
    // Special handling for isCurrentLocationDifferent
    if (field === 'isCurrentLocationDifferent') {
      // Don't auto-progress, just update the value and clear location data if needed
      if (value === 'false') {
        onClearLocationData();
      }
      return;
    }
    
    // Only auto-progress for non-address fields
    const addressFields = ['streetAddress', 'suburb', 'state', 'postcode', 'currentStreetAddress', 'currentSuburb', 'currentState', 'currentPostcode'];
    if (!addressFields.includes(field)) {
      onContinue();
    }
  };

  const handleDateFieldChange = async (field: string, value: string, step: RegistrationStep) => {
    if (isTransitioning) return;
    
    await onInputChange(field as keyof RegistrationData & string, value);

    // If we have a valid 2-digit value, move to next field or validate
    if (value.length === step.maxLength) {
      const validationError = step.validation?.(value, formData);
      if (!validationError) {
        if (field === 'birthDay') {
          monthInputRef.current?.focus();
        } else if (field === 'birthMonth') {
          yearInputRef.current?.focus();
        } else if (field === 'birthYear' && value.length === 4) {
          onContinue();
        }
      }
    }
  };

  const renderInput = (step: RegistrationStep) => {
    const field = step.field as string;
    const value = (currentInputs[field]?.toString() || formData[field]?.toString() || '') as string;
    const hasError = !!error && !isTransitioning && step.validation && step.validation(value, formData) === error;

    // Special handling for current location map
    if (field === 'currentStreetAddress' && formData.isCurrentLocationDifferent) {
      return (
        <>
          <LocationMap onLocationConfirmed={onLocationConfirmed} />
          <InputWrapper>
            <InputLabel>{step.placeholder}</InputLabel>
            <AddressInputGroup>
              <AddressAutocomplete>
                <Input
                  type={step.type}
                  value={value}
                  onChange={(e) => {
                    onInputChange(field as keyof RegistrationData & string, e.target.value);
                    onAddressSearch(e.target.value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && onContinue()}
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
                        onClick={() => onAddressSelect(suggestion)}
                      >
                        {suggestion.streetAddress}, {suggestion.suburb} {suggestion.state} {suggestion.postcode}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </AddressAutocomplete>
              <LocationButton
                onClick={onGetLocation}
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

    // Special handling for date fields
    if (step.isDateField) {
      return (
        <DateFieldWrapper key={field}>
          <InputLabel>{step.label}</InputLabel>
          <Input
            type={step.type}
            value={value}
            onChange={(e) => handleDateFieldChange(field, e.target.value, step)}
            onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && onContinue()}
            placeholder={step.placeholder}
            pattern={step.pattern}
            maxLength={step.maxLength}
            hasError={hasError}
            disabled={isTransitioning}
            $isDateField
            ref={field === 'birthMonth' ? monthInputRef : field === 'birthYear' ? yearInputRef : undefined}
          />
        </DateFieldWrapper>
      );
    }

    switch (step.type) {
      case 'multifield':
        return (
          <>
            {step.fields?.map((field) => {
              const fieldValue = currentInputs[field.field]?.toString() || formData[field.field]?.toString() || '';
              const hasFieldError = !!error && !isTransitioning && step.validation && 
                step.validation({ ...formData, [field.field]: fieldValue }, formData) === error;

              return (
                <InputWrapper key={field.field}>
                  <InputLabel>{field.label}</InputLabel>
                  {field.type === 'textarea' ? (
                    <Input
                      as="textarea"
                      value={fieldValue}
                      onChange={(e) => {
                        // Auto-resize the textarea
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                        onInputChange(field.field as keyof RegistrationData & string, e.target.value);
                      }}
                      placeholder={field.placeholder}
                      hasError={field.required && hasFieldError}
                      disabled={isTransitioning}
                      $isTextarea
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      value={fieldValue}
                      onChange={(e) => onInputChange(field.field as keyof RegistrationData & string, e.target.value)}
                      hasError={field.required && hasFieldError}
                      disabled={isTransitioning}
                    >
                      <option value="">{field.placeholder || 'Select an option'}</option>
                      {field.options?.map((option) => (
                        <option 
                          key={typeof option === 'string' ? option : option.value} 
                          value={typeof option === 'string' ? option : option.value}
                        >
                          {typeof option === 'string' ? option : option.label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      value={fieldValue}
                      onChange={(e) => onInputChange(field.field as keyof RegistrationData & string, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && onContinue()}
                      placeholder={field.placeholder}
                      pattern={field.pattern}
                      maxLength={field.maxLength}
                      hasError={field.required && hasFieldError}
                      disabled={isTransitioning}
                    />
                  )}
                  {field.helpText && <HelpText>{field.helpText}</HelpText>}
                </InputWrapper>
              );
            })}
          </>
        );
      case 'custom':
        if (!step.component) {
          console.error('Custom component type specified but no component provided');
          return null;
        }
        const CustomComponent = step.component;
        return (
          <CustomComponent
            formData={formData}
            currentInputs={currentInputs}
            onInputChange={onInputChange}
            error={hasError ? error : undefined}
            isTransitioning={isTransitioning}
            step={step}
          />
        );
      case 'select':
        return (
          <InputWrapper>
            <InputLabel>{step.placeholder || 'Select an option'}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleSelectChange(field, e.target.value)}
              hasError={hasError}
              disabled={isTransitioning}
            >
              <option value="">Select an option</option>
              {step.options?.map((option) => (
                <option 
                  key={typeof option === 'string' ? option : option.value} 
                  value={typeof option === 'string' ? option : option.value}
                >
                  {typeof option === 'string' ? option : option.label}
                </option>
              ))}
            </Select>
          </InputWrapper>
        );
      case 'radio':
      case 'boolean':
        return (
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name={field}
                value="true"
                checked={value === 'true'}
                onChange={() => {
                  if (isTransitioning) return;
                  onInputChange(field as keyof RegistrationData & string, 'true');
                  if (step.type === 'boolean') onContinue();
                }}
                disabled={isTransitioning}
              />
              <RadioButton>Yes</RadioButton>
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name={field}
                value="false"
                checked={value === 'false'}
                onChange={() => {
                  if (isTransitioning) return;
                  onInputChange(field as keyof RegistrationData & string, 'false');
                  if (step.type === 'boolean') onContinue();
                }}
                disabled={isTransitioning}
              />
              <RadioButton>No</RadioButton>
            </RadioLabel>
          </RadioGroup>
        );
      default:
        // Special handling for street address to add location button
        if (field === 'streetAddress') {
          return (
            <InputWrapper>
              <InputLabel>{step.placeholder}</InputLabel>
              <AddressInputGroup>
                <AddressAutocomplete>
                  <Input
                    type={step.type}
                    value={value}
                    onChange={(e) => {
                      onInputChange(field as keyof RegistrationData & string, e.target.value);
                      onAddressSearch(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && onContinue()}
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
                          onClick={() => onAddressSelect(suggestion)}
                        >
                          {suggestion.streetAddress}, {suggestion.suburb} {suggestion.state} {suggestion.postcode}
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </AddressAutocomplete>
                <LocationButton
                  onClick={onGetLocation}
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
          <InputWrapper layout={step.layout}>
            <InputLabel>{step.label || step.placeholder}</InputLabel>
            <Input
              type={step.type}
              value={value}
              onChange={(e) => onInputChange(field as keyof RegistrationData & string, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTransitioning && onContinue()}
              placeholder={step.placeholder}
              pattern={step.pattern}
              maxLength={step.maxLength}
              hasError={hasError}
              disabled={isTransitioning}
            />
          </InputWrapper>
        );
    }
  };

  const currentHelpText = typeof currentStep.helpText === 'function'
    ? currentStep.helpText(formData)
    : currentStep.helpText;

  const shouldShowError = () => {
    if (!error || isTransitioning) return false;
    
    // Get all possible validation errors for current steps
    const possibleErrors = currentSteps.map(step => {
      if (!step.validation) return [];
      const value = (currentInputs[step.field]?.toString() || formData[step.field]?.toString() || '') as string;
      const validationError = step.validation(value, formData);
      return validationError || '';
    }).filter(Boolean);

    return possibleErrors.includes(error);
  };

  return (
    <QuestionWrapper>
      <ProgressIndicator {...progressInfo} />
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
            {step.isDateField && index === 0 ? (
              <>
                {shouldShowError() && !nextStepQueued && <ErrorMessage>{error}</ErrorMessage>}
                <DateFieldsContainer>
                  {currentSteps.map(dateStep => renderInput(dateStep))}
                </DateFieldsContainer>
              </>
            ) : !step.isDateField && renderInput(step)}
          </React.Fragment>
        ))}
        {currentHelpText && !nextStepQueued && <HelpText>{currentHelpText}</HelpText>}
        {shouldShowError() && !nextStepQueued && !currentStep.isDateField && <ErrorMessage>{error}</ErrorMessage>}
      </QuestionContainer>
    </QuestionWrapper>
  );
}; 