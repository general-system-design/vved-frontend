import { RegistrationStep } from '../types';

export const addressSteps: RegistrationStep[] = [
  {
    id: 'streetAddress',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s residential address?` :
          "What is the patient's residential address?";
      }
      return "What's your residential address?";
    },
    field: 'streetAddress',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter the street address';
      return undefined;
    },
    placeholder: 'Street address (e.g., 1 Smith Street)',
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Enter ${formData.firstName}'s street number and name` :
          "Enter the patient's street number and name";
      }
      return "Enter your street number and name";
    }
  },
  {
    id: 'suburb',
    question: "",
    field: 'suburb',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter the suburb';
      return undefined;
    },
    placeholder: 'Suburb',
    skipQuestion: true
  },
  {
    id: 'state',
    question: "",
    field: 'state',
    type: 'select',
    options: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    validation: (value) => {
      if (!value) return 'Please select the state';
      return undefined;
    },
    placeholder: 'Select state',
    skipQuestion: true
  },
  {
    id: 'postcode',
    question: "",
    field: 'postcode',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter the postcode';
      if (!/^\d{4}$/.test(value)) return 'Please enter a valid 4-digit postcode';
      return undefined;
    },
    pattern: '\\d{4}',
    placeholder: 'Postcode',
    skipQuestion: true,
    helpText: "Enter the 4-digit postcode"
  }
]; 