import { useState, useCallback } from 'react';

interface ConversationStep {
  id: string;
  question: string;
  type: 'text' | 'date' | 'tel' | 'select';
  field: keyof RegistrationData;
  validation?: (value: string) => string | undefined;
  options?: string[];
  placeholder?: string;
  pattern?: string;
  helpText?: string;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicareNumber: string;
  phone: string;
  email: string;
  preferredLanguage: string;
  nokName: string;
  nokRelationship: string;
  nokContact: string;
}

const initialData: RegistrationData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  medicareNumber: '',
  phone: '',
  email: '',
  preferredLanguage: 'English',
  nokName: '',
  nokRelationship: '',
  nokContact: ''
};

const conversationSteps: ConversationStep[] = [
  {
    id: 'name',
    question: "What's your first name?",
    type: 'text',
    field: 'firstName',
    validation: (value) => 
      value.trim().length < 2 ? 'Please enter your first name' : undefined,
    placeholder: 'Enter your first name'
  },
  {
    id: 'lastName',
    question: "And your last name?",
    type: 'text',
    field: 'lastName',
    validation: (value) => 
      value.trim().length < 2 ? 'Please enter your last name' : undefined,
    placeholder: 'Enter your last name'
  },
  {
    id: 'medicare',
    question: "What's your Medicare number? You can find this on your Medicare card.",
    type: 'tel',
    field: 'medicareNumber',
    validation: (value) => 
      /^\d{10}$/.test(value) ? undefined : 'Please enter a valid 10-digit Medicare number',
    pattern: '\\d{10}',
    placeholder: 'Enter your Medicare number',
    helpText: 'Your 10-digit Medicare number from your green Medicare card'
  },
  {
    id: 'dob',
    question: "What's your date of birth?",
    type: 'date',
    field: 'dateOfBirth',
    validation: (value) => {
      const date = new Date(value);
      const today = new Date();
      return date <= today ? undefined : 'Please enter a valid date';
    }
  },
  {
    id: 'phone',
    question: "What's the best phone number to reach you?",
    type: 'tel',
    field: 'phone',
    validation: (value) => 
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    placeholder: 'Enter your mobile number',
    helpText: 'Australian mobile number starting with 04'
  },
  {
    id: 'email',
    question: "What's your email address?",
    type: 'text',
    field: 'email',
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : 'Please enter a valid email address';
    },
    placeholder: 'Enter your email address'
  },
  {
    id: 'language',
    question: "What's your preferred language?",
    type: 'select',
    field: 'preferredLanguage',
    options: [
      'English',
      'Mandarin',
      'Arabic',
      'Vietnamese',
      'Cantonese',
      'Italian',
      'Greek',
      'Hindi',
      'Spanish',
      'Other'
    ]
  },
  {
    id: 'nokName',
    question: "In case of emergency, who should we contact?",
    type: 'text',
    field: 'nokName',
    validation: (value) => 
      value.trim().length < 2 ? 'Please enter a name' : undefined,
    placeholder: "Enter your emergency contact's name"
  },
  {
    id: 'nokRelationship',
    question: "What's their relationship to you?",
    type: 'text',
    field: 'nokRelationship',
    validation: (value) => 
      value.trim().length < 2 ? 'Please specify the relationship' : undefined,
    placeholder: 'e.g., Spouse, Parent, Child'
  },
  {
    id: 'nokContact',
    question: "What's their contact number?",
    type: 'tel',
    field: 'nokContact',
    validation: (value) => 
      /^\d{10}$/.test(value) ? undefined : 'Please enter a valid phone number',
    pattern: '\\d{10}',
    placeholder: 'Enter their contact number'
  }
];

export const useConversationFlow = (isEmergency: boolean) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>(initialData);
  const [error, setError] = useState<string | undefined>();

  const currentStep = conversationSteps[currentStepIndex];
  const progress = Math.round((currentStepIndex / conversationSteps.length) * 100);

  const validateAnswer = useCallback((value: string) => {
    if (!currentStep.validation) return undefined;
    return currentStep.validation(value);
  }, [currentStep]);

  const handleAnswer = useCallback((answer: string) => {
    const error = validateAnswer(answer);
    if (error) {
      setError(error);
      return false;
    }

    setFormData(prev => ({
      ...prev,
      [currentStep.field]: answer
    }));

    if (currentStepIndex < conversationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setError(undefined);
    return true;
  }, [currentStep, currentStepIndex, validateAnswer]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setError(undefined);
    }
  }, [currentStepIndex]);

  return {
    currentStep,
    formData,
    error,
    progress,
    handleAnswer,
    goBack,
    isComplete: currentStepIndex === conversationSteps.length - 1
  };
}; 