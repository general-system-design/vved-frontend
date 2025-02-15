import { RegistrationData, RegistrationStep } from '../types/index';

export const addressSteps: RegistrationStep[] = [
  {
    id: 'isCurrentLocationDifferent',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Is ${formData.firstName} currently at their residential address?` :
          "Is the patient currently at their residential address?";
      }
      return "Are you currently at your residential address?";
    },
    field: 'isCurrentLocationDifferent',
    type: 'radio',
    validation: (value: string) => {
      if (value === undefined || value === '') return 'Please answer this question';
      return undefined;
    }
  },
  {
    id: 'currentStreetAddress',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s current location?` :
          "What is the patient's current location?";
      }
      return "What's your current location?";
    },
    field: 'currentStreetAddress',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the street address';
      return undefined;
    },
    placeholder: 'Street address (e.g., 1 Smith Street)',
    helpText: "This helps us know where to send emergency services if needed",
    skipIf: (formData: RegistrationData) => !formData.isCurrentLocationDifferent
  },
  {
    id: 'currentSuburb',
    question: "",
    field: 'currentSuburb',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the suburb';
      return undefined;
    },
    placeholder: 'Suburb',
    skipQuestion: true,
    skipIf: (formData: RegistrationData) => !formData.isCurrentLocationDifferent
  },
  {
    id: 'currentState',
    question: "",
    field: 'currentState',
    type: 'text',
    validation: (value: string) => {
      const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
      if (!value) return 'Please select the state';
      if (!validStates.includes(value)) return 'Please enter a valid state abbreviation';
      return undefined;
    },
    placeholder: 'State (e.g., NSW)',
    skipQuestion: true,
    skipIf: (formData: RegistrationData) => !formData.isCurrentLocationDifferent
  },
  {
    id: 'currentPostcode',
    question: "",
    field: 'currentPostcode',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the postcode';
      if (!/^\d{4}$/.test(value)) return 'Please enter a valid 4-digit postcode';
      return undefined;
    },
    pattern: '\\d{4}',
    placeholder: 'Postcode',
    skipQuestion: true,
    skipIf: (formData: RegistrationData) => !formData.isCurrentLocationDifferent,
    helpText: "Enter the 4-digit postcode"
  },
  {
    id: 'streetAddress',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s residential address?` :
          "What is the patient's residential address?";
      }
      return "What's your residential address?";
    },
    field: 'streetAddress',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter the street address';
      return undefined;
    },
    placeholder: 'Street address (e.g., 1 Smith Street)',
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Enter ${formData.firstName}'s permanent residential address` :
          "Enter the patient's permanent residential address";
      }
      return "Enter your permanent residential address";
    }
  },
  {
    id: 'suburb',
    question: "",
    field: 'suburb',
    type: 'text',
    validation: (value: string) => {
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
    type: 'text',
    validation: (value: string) => {
      const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
      if (!value) return 'Please select the state';
      if (!validStates.includes(value)) return 'Please enter a valid state abbreviation';
      return undefined;
    },
    placeholder: 'State (e.g., NSW)',
    skipQuestion: true
  },
  {
    id: 'postcode',
    question: "",
    field: 'postcode',
    type: 'text',
    validation: (value: string) => {
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