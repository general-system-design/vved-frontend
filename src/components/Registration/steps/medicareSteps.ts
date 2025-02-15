import { RegistrationStep, RegistrationData } from '../types/index';

export const medicareSteps: RegistrationStep[] = [
  {
    id: 'hasMedicareCard',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Does ${formData.firstName} have a Medicare card?` :
          "Does the patient have a Medicare card?";
      }
      return "Do you have a Medicare card?";
    },
    field: 'hasMedicareCard',
    type: 'radio',
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `We'll need ${formData.firstName}'s Medicare details for billing` :
          "We'll need the patient's Medicare details for billing";
      }
      return "We'll need your Medicare details for billing";
    }
  },
  {
    id: 'medicareNumber',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s Medicare number?` :
          "What is the patient's Medicare number?";
      }
      return "What is your Medicare number?";
    },
    field: 'medicareNumber',
    type: 'text',
    validation: (value: string) => {
      if (!value) return 'Please enter your Medicare number';
      if (!/^\d{10}$/.test(value)) return 'Medicare number must be 10 digits';
      return undefined;
    },
    pattern: '\\d{10}',
    placeholder: 'XXXXXXXXXX',
    skipIf: (formData: RegistrationData) => formData.hasMedicareCard === 'No' || formData.hasMedicareCard === ''
  }
]; 