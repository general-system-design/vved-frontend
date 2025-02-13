import { RegistrationStep } from '../types';

export const culturalSteps: RegistrationStep[] = [
  {
    id: 'preferredLanguage',
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
    id: 'needsInterpreter',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Would you like us to arrange an interpreter for ${formData.firstName}?` :
          "Would you like us to arrange an interpreter for the patient?";
      }
      return "Would you like us to arrange an interpreter?";
    },
    field: 'needsInterpreter',
    type: 'select',
    options: ['Yes', 'No'],
    skipIf: (formData) => formData.preferredLanguage === 'English',
    validation: (value) => value ? undefined : 'Please indicate if an interpreter is needed',
    helpText: "We can arrange a professional interpreter at no cost"
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