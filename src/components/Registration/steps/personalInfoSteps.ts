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
    validation: (value: string | RegistrationData) => {
      const titleValue = typeof value === 'string' ? value : value.title;
      return !titleValue ? 'Please select a title' : undefined;
    },
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
    validation: (value: string | RegistrationData) => {
      const firstNameValue = typeof value === 'string' ? value : value.firstName;
      if (!firstNameValue) return 'First name is required';
      if (firstNameValue.length < 2) return 'First name must be at least 2 characters';
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
    validation: (value: string | RegistrationData) => {
      const lastNameValue = typeof value === 'string' ? value : value.lastName;
      if (!lastNameValue) return 'Last name is required';
      if (lastNameValue.length < 2) return 'Last name must be at least 2 characters';
      return undefined;
    },
    placeholder: 'Last name',
    skipQuestion: true
  },
  {
    id: 'birthDate',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s date of birth?` :
          "What is the patient's date of birth?";
      }
      return "What is your date of birth?";
    },
    field: 'birthDay',
    type: 'text',
    validation: (value: string | RegistrationData, formData?: RegistrationData) => {
      const day = typeof value === 'string' ? value : value.birthDay;
      const month = formData?.birthMonth || '';
      const year = formData?.birthYear || '';

      if (!day) return 'Please enter the day (1-31)';
      if (!/^\d{1,2}$/.test(day) || parseInt(day) < 1 || parseInt(day) > 31) {
        return 'Please enter a valid day (1-31)';
      }
      
      if (month && year) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (date > new Date()) return 'Date of birth cannot be in the future';
        if (date.getDate() !== parseInt(day)) return 'Invalid date for the selected month';
      }
      
      return undefined;
    },
    pattern: '[0-9]*',
    maxLength: 2,
    placeholder: 'DD',
    label: 'Day',
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This helps us locate ${formData.firstName}'s medical records and provide age-appropriate care` :
          "This helps us locate the patient's medical records and provide age-appropriate care";
      }
      return "This helps us locate your medical records and provide age-appropriate care";
    },
    shouldShowContinue: true,
    layout: 'inline-3',
    isDateField: true
  },
  {
    id: 'birthMonth',
    question: "",
    field: 'birthMonth',
    type: 'text',
    validation: (value: string | RegistrationData) => {
      const month = typeof value === 'string' ? value : value.birthMonth;
      if (!month) return 'Please enter the month';
      if (!/^\d{1,2}$/.test(month) || parseInt(month) < 1 || parseInt(month) > 12) {
        return 'Please enter a valid month (1-12)';
      }
      return undefined;
    },
    pattern: '[0-9]*',
    maxLength: 2,
    placeholder: 'MM',
    label: 'Month',
    skipQuestion: true,
    layout: 'inline-3',
    isDateField: true
  },
  {
    id: 'birthYear',
    question: "",
    field: 'birthYear',
    type: 'text',
    validation: (value: string | RegistrationData) => {
      const year = typeof value === 'string' ? value : value.birthYear;
      if (!year) return 'Please enter the year';
      if (!/^\d{4}$/.test(year)) return 'Please enter a valid 4-digit year';
      
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      if (yearNum > currentYear) return 'Year cannot be in the future';
      if (yearNum < currentYear - 120) return 'Please enter a valid year';
      
      return undefined;
    },
    pattern: '[0-9]*',
    maxLength: 4,
    placeholder: 'YYYY',
    label: 'Year',
    skipQuestion: true,
    layout: 'inline-3',
    isDateField: true
  }
]; 