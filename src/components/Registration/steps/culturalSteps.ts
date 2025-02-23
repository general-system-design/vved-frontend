import { RegistrationStep } from '../types/index';

export const culturalSteps: RegistrationStep[] = [
  {
    id: 'countryOfBirth',
    question: (formData) => formData.isThirdParty === 'For someone else' ?
      `Which country was ${formData.firstName || 'the patient'} born in?` :
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
    id: 'indigenousStatus',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Does ${formData.firstName} identify as Aboriginal and/or Torres Strait Islander?` :
          "Does the patient identify as Aboriginal and/or Torres Strait Islander?";
      }
      return "Do you identify as Aboriginal and/or Torres Strait Islander?";
    },
    field: 'indigenousStatus',
    type: 'select',
    options: [
      'No',
      'Yes, Aboriginal',
      'Yes, Torres Strait Islander',
      'Yes, both Aboriginal and Torres Strait Islander',
      'Prefer not to say'
    ],
    validation: (value) => value ? undefined : 'Please select an option',
    helpText: "This information helps us provide culturally appropriate care and access to specific health services"
  },
  {
    id: 'needsInterpreter',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Does ${formData.firstName} need an interpreter?` :
          "Does the patient need an interpreter?";
      }
      return "Do you need an interpreter?";
    },
    field: 'needsInterpreter',
    type: 'select',
    options: ['Yes', 'No'],
    validation: (value) => value ? undefined : 'Please indicate if an interpreter is needed',
    helpText: "We can arrange a professional interpreter at no cost"
  },
  {
    id: 'culturalInfo',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s preferred language?` :
          "What is the patient's preferred language?";
      }
      return "What is your preferred language?";
    },
    field: 'preferredLanguage',
    type: 'select',
    options: [
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
    skipIf: (formData) => {
      if (typeof formData.needsInterpreter === 'string') {
        return formData.needsInterpreter === 'No' || formData.needsInterpreter === 'false';
      }
      return false;
    },
    validation: (value) => value ? undefined : 'Please select a preferred language',
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This helps us ensure effective communication during ${formData.firstName}'s visit` :
          "This helps us ensure effective communication during the patient's visit";
      }
      return "This helps us ensure effective communication during your visit";
    }
  },
  {
    id: 'religion',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s religion? (optional)` :
          "What is the patient's religion? (optional)";
      }
      return "What is your religion? (optional)";
    },
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
    validation: () => undefined,
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This helps us provide culturally appropriate care for ${formData.firstName}` :
          "This helps us provide culturally appropriate care for the patient";
      }
      return "This helps us provide culturally appropriate care";
    }
  }
]; 