import { useState, useCallback } from 'react';

export interface RegistrationData {
  // Registration context
  isThirdParty: 'For myself' | 'For someone else' | '';
  registrantRelationship?: string;
  registrantName?: string;
  registrantContact?: string;
  hasAuthority: boolean;

  // Patient details
  title: string;
  firstName: string;
  lastName: string;
  medicareNumber: string;
  hasMedicareCard: 'Yes' | 'No' | '';
  dateOfBirth: string;
  countryOfBirth: string;
  phone: string;
  email: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  otherLanguages: string[];
  needsInterpreter: boolean;
  religion?: string;
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  useCurrentLocation: boolean;
  gpName?: string;
  gpClinic?: string;
  gpAddress?: string;
  nokName: string;
  nokRelationship: string;
  nokContact: string;
}

export interface RegistrationStep {
  id: string;
  question: string | ((formData: RegistrationData) => string);
  field: keyof RegistrationData;
  type: 'text' | 'tel' | 'date' | 'email' | 'select' | 'boolean';
  validation?: (value: string) => string | undefined;
  options?: string[];
  placeholder?: string;
  pattern?: string;
  helpText?: string | ((formData: RegistrationData) => string);
  followUpQuestion?: (value: string) => string | undefined;
  skipIf?: (formData: RegistrationData) => boolean;
  skipQuestion?: boolean;
}

const initialData: RegistrationData = {
  isThirdParty: '',
  hasAuthority: false,
  title: '',
  firstName: '',
  lastName: '',
  medicareNumber: '',
  hasMedicareCard: '',
  dateOfBirth: '',
  countryOfBirth: '',
  phone: '',
  email: '',
  preferredContactMethod: '',
  preferredLanguage: 'English',
  otherLanguages: [],
  needsInterpreter: false,
  religion: '',
  streetAddress: '',
  suburb: '',
  state: '',
  postcode: '',
  useCurrentLocation: false,
  gpName: '',
  gpClinic: '',
  gpAddress: '',
  nokName: '',
  nokRelationship: '',
  nokContact: ''
};

const registrationSteps: RegistrationStep[] = [
  {
    id: 'registrationType',
    question: "Are you completing this registration for yourself or for someone else?",
    field: 'isThirdParty',
    type: 'select',
    options: ['For myself', 'For someone else'],
    validation: (value) => {
      if (!value) return 'Please select who you are registering';
      return undefined;
    },
    helpText: "This helps us tailor the registration process appropriately"
  },
  {
    id: 'registrantName',
    question: "What is your full name?",
    field: 'registrantName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter your full name';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: "We'll need this for our records and to verify your authority"
  },
  {
    id: 'registrantRelationship',
    question: "What is your relationship to the patient?",
    field: 'registrantRelationship',
    type: 'select',
    options: [
      'Parent/Guardian',
      'Spouse/Partner',
      'Adult Child',
      'Sibling',
      'Legal Representative',
      'Professional Carer',
      'Support Worker',
      'Other Family Member',
      'Other'
    ],
    validation: (value) => value ? undefined : 'Please specify your relationship to the patient',
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: "This helps us understand your connection to the patient"
  },
  {
    id: 'registrantContact',
    question: "What's the best number to reach you on?",
    field: 'registrantContact',
    type: 'tel',
    validation: (value) => /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: "We may need to contact you about this registration or for additional information"
  },
  {
    id: 'authority',
    question: (formData) => {
      if (formData.registrantRelationship === 'Parent/Guardian') {
        return "Are you the legal guardian or have parental responsibility?";
      }
      if (formData.registrantRelationship === 'Legal Representative') {
        return "Do you have legal authority (e.g., Power of Attorney) to act on behalf of the patient?";
      }
      return "Do you have the authority to provide medical information on behalf of the patient?";
    },
    field: 'hasAuthority',
    type: 'select',
    options: ['Yes', 'No'],
    validation: (value) => {
      if (value === 'No') {
        return 'You need legal authority to register on behalf of someone else. Please have the patient complete the registration or provide proof of authority.';
      }
      return undefined;
    },
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: (formData) => {
      if (formData.registrantRelationship === 'Parent/Guardian') {
        return "This confirms you have the legal right to make healthcare decisions for the patient";
      }
      if (formData.registrantRelationship === 'Legal Representative') {
        return "This could be through Power of Attorney, Guardianship, or other legal documentation";
      }
      return "You must have the legal authority to provide medical information and make healthcare decisions";
    }
  },
  {
    id: 'personalDetails',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return `Now, let's get the patient's details. What title do they go by?`;
      }
      return "Let's start with your details. What title do you go by?";
    },
    field: 'title',
    type: 'select',
    options: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Mx', 'Other'],
    validation: (value) => value ? undefined : 'Please select a title',
    placeholder: 'Select title',
    helpText: (formData) => formData.isThirdParty === 'For someone else' ? 
      "How should we address the patient?" : 
      "How would you like us to address you?"
  },
  {
    id: 'name',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What is the patient's name?" :
      "What's your name?",
    field: 'firstName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter the first name';
      if (value.trim().length < 2) return 'First name must be at least 2 characters';
      return undefined;
    },
    placeholder: 'First name'
  },
  {
    id: 'lastName',
    question: "",
    field: 'lastName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter the last name';
      if (value.trim().length < 2) return 'Last name must be at least 2 characters';
      return undefined;
    },
    placeholder: 'Last name',
    skipQuestion: true
  },
  {
    id: 'dateOfBirth',
    question: (formData) => formData.isThirdParty ?
      "When was the patient born?" :
      "When were you born?",
    field: 'dateOfBirth',
    type: 'date',
    validation: (value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return date <= today && age <= 120 ? undefined : 'Please enter a valid date of birth';
    },
    helpText: "This helps us locate the correct medical records"
  },
  {
    id: 'countryOfBirth',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "Which country was the patient born in?" :
      "Which country were you born in?",
    field: 'countryOfBirth',
    type: 'select',
    options: [
      'Australia',
      'New Zealand',
      'United Kingdom',
      'China',
      'India',
      'Philippines',
      'Vietnam',
      'Malaysia',
      'Indonesia',
      'South Africa',
      'Other'
    ],
    validation: (value) => value ? undefined : 'Please select country of birth',
    helpText: (formData) => formData.isThirdParty === 'For someone else' ?
      "This helps us understand the patient's cultural and healthcare background" :
      "This helps us understand your cultural and healthcare background"
  },
  {
    id: 'hasMedicareCard',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "Do you have access to the patient's Medicare card?" :
      "Do you have your Medicare card with you?",
    field: 'hasMedicareCard',
    type: 'select',
    options: ['Yes', 'No'],
    helpText: (formData) => formData.isThirdParty === 'For someone else' ?
      "We'll need the patient's Medicare number from their green Medicare card" :
      "We'll need your Medicare number from your green Medicare card"
  },
  {
    id: 'medicareNumber',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "Please enter the patient's Medicare number" :
      "Please enter your Medicare number",
    field: 'medicareNumber',
    type: 'tel',
    validation: (value) => {
      if (!/^\d{10}$/.test(value)) {
        return 'Please enter a valid 10-digit Medicare number';
      }
      return undefined;
    },
    pattern: '\\d{10}',
    placeholder: 'Medicare number',
    skipIf: (formData) => formData.hasMedicareCard === 'No' || formData.hasMedicareCard === '',
    helpText: "The Medicare number is a 10-digit number found on the green Medicare card"
  },
  {
    id: 'contact',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What's the best way to contact the patient directly?" :
      "What's the best way to contact you?",
    field: 'preferredContactMethod',
    type: 'select',
    options: ['Mobile Phone', 'Email', 'Home Phone'],
    validation: (value) => value ? undefined : 'Please select a preferred contact method',
    helpText: (formData) => formData.isThirdParty === 'For someone else' ?
      "We'll use this to communicate directly with the patient about their care" :
      "We'll use this for important communications about your care"
  },
  {
    id: 'phone',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What is the patient's mobile number?" :
      "What's your mobile number?",
    field: 'phone',
    type: 'tel',
    validation: (value) => 
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    placeholder: 'Mobile number',
    skipIf: (formData) => formData.preferredContactMethod === 'Email',
    helpText: "This should be a number where we can reach the patient directly"
  },
  {
    id: 'email',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What is the patient's email address?" :
      "What's your email address?",
    field: 'email',
    type: 'email',
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : 'Please enter a valid email address';
    },
    placeholder: 'Email address',
    skipIf: (formData) => formData.preferredContactMethod === 'Mobile Phone' || formData.preferredContactMethod === 'Home Phone',
    helpText: (formData) => formData.isThirdParty === 'For someone else' ?
      "We'll use this to send important information about their care" :
      "We'll use this to send important information about your care"
  },
  {
    id: 'preferredLanguage',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What is the patient's preferred language?" :
      "What is your preferred language?",
    field: 'preferredLanguage',
    type: 'select',
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
    ],
    validation: (value) => value ? undefined : 'Please select a preferred language',
    helpText: "This helps us ensure effective communication during your visit"
  },
  {
    id: 'needsInterpreter',
    question: "Would you like us to arrange an interpreter?",
    field: 'needsInterpreter',
    type: 'select',
    options: ['Yes', 'No'],
    skipIf: (formData) => formData.preferredLanguage === 'English',
    validation: (value) => value ? undefined : 'Please indicate if you need an interpreter',
    helpText: "We can arrange a professional interpreter at no cost to you"
  },
  {
    id: 'religion',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What is the patient's religion? (optional)" :
      "What is your religion? (optional)",
    field: 'religion',
    type: 'select',
    options: [
      'No Religion',
      'Christianity',
      'Islam',
      'Buddhism',
      'Hinduism',
      'Judaism',
      'Sikhism',
      'Other',
      'Prefer not to say'
    ],
    helpText: "This helps us provide culturally appropriate care"
  },
  {
    id: 'useCurrentLocation',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "Would you like to use the patient's current location?" :
      "Would you like to use your current location?",
    field: 'useCurrentLocation',
    type: 'select',
    options: ['Yes', 'No'],
    validation: (value) => value ? undefined : 'Please select whether to use current location',
    helpText: "We can automatically detect your location to save time"
  },
  {
    id: 'address',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "What is the patient's residential address?" :
      "What's your residential address?",
    field: 'streetAddress',
    type: 'select',
    validation: (value) => {
      if (!value) return 'Please select an address from the suggestions';
      return undefined;
    },
    skipIf: (formData) => formData.useCurrentLocation === true,
    placeholder: 'Start typing to search address...',
    helpText: "Type your address and select from the suggestions",
    options: [
      '1 Smith Street, Sydney NSW 2000',
      '1 Smith Street, Melbourne VIC 3000',
      '1 Smith Street, Brisbane QLD 4000',
      '2 Smith Street, Sydney NSW 2000',
      '2 Smith Street, Melbourne VIC 3000',
      '2 Smith Street, Brisbane QLD 4000',
      '10 Park Road, Sydney NSW 2000',
      '10 Park Road, Melbourne VIC 3000',
      '10 Park Road, Brisbane QLD 4000',
      '15 Beach Avenue, Sydney NSW 2000',
      '15 Beach Avenue, Melbourne VIC 3000',
      '15 Beach Avenue, Brisbane QLD 4000'
    ]
  },
  {
    id: 'addressConfirm',
    question: "Is this your correct address?",
    field: 'streetAddress',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please confirm your address';
      return undefined;
    },
    skipQuestion: true,
    helpText: "Please verify that all address details are correct"
  },
  {
    id: 'suburb',
    question: "",
    field: 'suburb',
    type: 'text',
    skipQuestion: true,
    skipIf: () => true // These fields are now auto-filled from the address selection
  },
  {
    id: 'state',
    question: "",
    field: 'state',
    type: 'select',
    options: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    skipQuestion: true,
    skipIf: () => true
  },
  {
    id: 'postcode',
    question: "",
    field: 'postcode',
    type: 'text',
    skipQuestion: true,
    skipIf: () => true
  },
  {
    id: 'emergencyContact',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return "Besides yourself, who else should we contact in case of emergency?";
      }
      return "Who should we contact in case of emergency?";
    },
    field: 'nokName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter a name';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    placeholder: "Emergency contact's name",
    helpText: (formData) => formData.isThirdParty === 'For someone else' ?
      "This should be someone other than yourself who can be contacted in an emergency" :
      "This should be someone we can contact if we can't reach you"
  },
  {
    id: 'nokRelationship',
    question: "",
    field: 'nokRelationship',
    type: 'select',
    options: [
      'Parent/Guardian',
      'Spouse/Partner',
      'Child',
      'Sibling',
      'Other Family Member',
      'Friend',
      'Neighbor',
      'Other'
    ],
    validation: (value) => value ? undefined : 'Please specify the relationship',
    placeholder: 'Their relationship to the patient',
    skipQuestion: true
  },
  {
    id: 'nokContact',
    question: "",
    field: 'nokContact',
    type: 'tel',
    validation: (value) => 
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    placeholder: 'Their mobile number',
    skipQuestion: true
  },
  {
    id: 'gpDetails',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      "Who is the patient's regular GP?" :
      "Who is your regular GP?",
    field: 'gpName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter GP name';
      return undefined;
    },
    placeholder: "GP's full name",
    helpText: "This helps us coordinate your care with your regular doctor"
  },
  {
    id: 'gpClinic',
    question: "",
    field: 'gpClinic',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter clinic name';
      return undefined;
    },
    placeholder: "Medical clinic name",
    skipQuestion: true
  },
  {
    id: 'gpAddress',
    question: "",
    field: 'gpAddress',
    type: 'select',
    options: [
      '123 Medical Centre, Sydney NSW 2000',
      '456 Family Practice, Melbourne VIC 3000',
      '789 Health Hub, Brisbane QLD 4000'
    ],
    validation: (value) => {
      if (!value) return 'Please select or enter clinic address';
      return undefined;
    },
    placeholder: "Search for clinic address",
    skipQuestion: true
  }
];

export const useRegistrationFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>(initialData);
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

  const validateAnswer = useCallback((value: string, step: RegistrationStep) => {
    if (!step.validation) return undefined;
    return step.validation(value);
  }, []);

  const handleAnswer = useCallback((answers: Record<string, string>): { 
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
    let nextStepIndex = currentStepIndex + steps.length;
    while (
      nextStepIndex < registrationSteps.length && 
      registrationSteps[nextStepIndex].skipIf?.(newFormData)
    ) {
      nextStepIndex++;
    }

    if (nextStepIndex < registrationSteps.length) {
      setCurrentStepIndex(nextStepIndex);
    }

    setError(undefined);
    return { success: true };
  }, [currentStepIndex, validateAnswer, formData]);

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
    setFormData(initialData);
    setError(undefined);
  }, []);

  return {
    currentStep,
    currentSteps: getCurrentSteps(),
    formData,
    error,
    progress,
    handleAnswer,
    goBack,
    isComplete: currentStepIndex === registrationSteps.length - 1,
    resetForm
  };
}; 