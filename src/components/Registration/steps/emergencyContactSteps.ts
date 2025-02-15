import { RegistrationStep, RegistrationData } from '../types/index';

export const emergencyContactSteps: RegistrationStep[] = [
  {
    id: 'useRegistrantAsEmergencyContact',
    question: (formData: RegistrationData) => formData.firstName ?
      `Would you like to be ${formData.firstName}'s emergency contact?` :
      "Would you like to be the patient's emergency contact?",
    field: 'useRegistrantAsEmergencyContact',
    type: 'radio',
    skipIf: (formData: RegistrationData) => formData.isThirdParty !== 'For someone else',
    options: ['Yes', 'No']
  },
  {
    id: 'nokName',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Who should we contact in an emergency for ${formData.firstName}?` :
          "Who should we contact in an emergency for the patient?";
      }
      return "Who should we contact in an emergency?";
    },
    field: 'nokName',
    type: 'text',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please enter a name';
      return undefined;
    },
    placeholder: 'Full name',
    skipIf: (formData: RegistrationData) =>
      formData.isThirdParty === 'For someone else' &&
      formData.useRegistrantAsEmergencyContact === 'Yes'
  },
  {
    id: 'nokRelationship',
    question: "What is their relationship to you?",
    field: 'nokRelationship',
    type: 'text',
    validation: (value: string) => value ? undefined : 'Please specify the relationship',
    placeholder: 'e.g., Parent, Spouse, Friend',
    skipIf: (formData: RegistrationData) =>
      formData.isThirdParty === 'For someone else' &&
      formData.useRegistrantAsEmergencyContact === 'Yes'
  },
  {
    id: 'nokContact',
    question: "What's their contact number?",
    field: 'nokContact',
    type: 'tel',
    validation: (value: string) =>
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04[0-9]{8}',
    placeholder: '04XX XXX XXX',
    skipIf: (formData: RegistrationData) =>
      formData.isThirdParty === 'For someone else' &&
      formData.useRegistrantAsEmergencyContact === 'Yes'
  }
]; 