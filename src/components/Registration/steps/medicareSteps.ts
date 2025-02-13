import { RegistrationStep } from '../types';

export const medicareSteps: RegistrationStep[] = [
  {
    id: 'hasMedicareCard',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Do you have access to ${formData.firstName}'s Medicare card?` :
          "Do you have access to the patient's Medicare card?";
      }
      return "Do you have your Medicare card with you?";
    },
    field: 'hasMedicareCard',
    type: 'select',
    options: ['Yes', 'No'],
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `We'll need ${formData.firstName}'s Medicare number from their green Medicare card` :
          "We'll need the patient's Medicare number from their green Medicare card";
      }
      return "We'll need your Medicare number from your green Medicare card";
    }
  },
  {
    id: 'medicareNumber',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Please enter ${formData.firstName}'s Medicare number` :
          "Please enter the patient's Medicare number";
      }
      return "Please enter your Medicare number";
    },
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
  }
]; 