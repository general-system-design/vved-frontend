import { RegistrationStep, RegistrationData } from '../types/index';

export const gpSteps: RegistrationStep[] = [
  {
    id: 'gpName',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Who is ${formData.firstName}'s regular GP?` :
          "Who is the patient's regular GP?";
      }
      return "Who is your regular GP?";
    },
    field: 'gpName',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter your GP name';
      return undefined;
    },
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Enter ${formData.firstName}'s regular doctor's name` :
          "Enter the patient's regular doctor's name";
      }
      return "Enter your regular doctor's name";
    },
    placeholder: "GP's full name"
  },
  {
    id: 'gpClinic',
    question: "What's the name of their medical clinic?",
    field: 'gpClinic',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the clinic name';
      return undefined;
    },
    placeholder: 'Medical clinic name'
  },
  {
    id: 'gpAddress',
    question: "What's the clinic's address?",
    field: 'gpAddress',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the clinic address';
      return undefined;
    },
    placeholder: 'Clinic address'
  }
]; 