import { RegistrationStep } from '../types';

export const personalInfoSteps: RegistrationStep[] = [
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
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s date of birth?` :
          "What is the patient's date of birth?";
      }
      return "What is your date of birth?";
    },
    field: 'dateOfBirth',
    type: 'date',
    validation: (value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return date <= today && age <= 120 ? undefined : 'Please enter a valid date of birth';
    },
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This helps us locate ${formData.firstName}'s medical records and provide age-appropriate care` :
          "This helps us locate the patient's medical records and provide age-appropriate care";
      }
      return "This helps us locate your medical records and provide age-appropriate care";
    }
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
  }
]; 