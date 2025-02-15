import { RegistrationStep, RegistrationData } from '../types/index';

export const personalInfoSteps: RegistrationStep[] = [
  {
    id: 'personalDetails',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return `Let's get the patient's details. What is their name and title?`;
      }
      return "Let's start with your details. What is your name and title?";
    },
    field: 'title',
    type: 'select',
    options: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Mx', 'Other'],
    validation: (value: string) => value ? undefined : 'Please select a title',
    placeholder: 'Select title',
    helpText: (formData: RegistrationData) => formData.isThirdParty === 'For someone else' ? 
      "How should we address the patient?" : 
      "How would you like us to address you?",
    shouldShowContinue: true
  },
  {
    id: 'firstName',
    question: "",
    field: 'firstName',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the first name';
      if (value.trim().length < 2) return 'First name must be at least 2 characters';
      return undefined;
    },
    placeholder: 'First name',
    skipQuestion: true
  },
  {
    id: 'lastName',
    question: "",
    field: 'lastName',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the last name';
      if (value.trim().length < 2) return 'Last name must be at least 2 characters';
      return undefined;
    },
    placeholder: 'Last name',
    skipQuestion: true
  },
  {
    id: 'dateOfBirth',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s date of birth?` :
          "What is the patient's date of birth?";
      }
      return "What is your date of birth?";
    },
    field: 'dateOfBirth',
    type: 'date',
    validation: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return date <= today && age <= 120 ? undefined : 'Please enter a valid date of birth';
    },
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This helps us locate ${formData.firstName}'s medical records and provide age-appropriate care` :
          "This helps us locate the patient's medical records and provide age-appropriate care";
      }
      return "This helps us locate your medical records and provide age-appropriate care";
    }
  }
]; 