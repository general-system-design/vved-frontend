import { RegistrationStep, RegistrationData } from '../types/index';

export const emergencyContactSteps: RegistrationStep[] = [
  {
    id: 'useRegistrantAsEmergencyContact',
    question: (formData: RegistrationData) => formData.firstName ?
      `Would you like to be ${formData.firstName}'s emergency contact?` :
      "Would you like to be the patient's emergency contact?",
    field: 'useRegistrantAsEmergencyContact',
    type: 'radio',
    options: ['Yes', 'No'],
    validation: (value: string | RegistrationData) => {
      if (typeof value !== 'string' || value === undefined || value === '') return 'Please answer this question';
      return undefined;
    },
    skipIf: (formData: RegistrationData) => formData.isThirdParty !== 'For someone else'
  },
  {
    id: 'emergencyContact',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Who should we contact in an emergency for ${formData.firstName}?` :
          "Who should we contact in an emergency for the patient?";
      }
      return "Who should we contact in an emergency?";
    },
    field: 'nokName',
    type: 'multifield',
    validation: (value: string | RegistrationData, formData?: RegistrationData) => {
      // When validating the entire form data
      if (typeof value !== 'string') {
        if (!value.nokName?.trim()) return 'Please enter a name';
        if (!value.nokRelationship?.trim()) return 'Please specify the relationship';
        if (!value.nokContact || !/^04\d{8}$/.test(value.nokContact)) return 'Please enter a valid Australian mobile number';
        return undefined;
      }
      return undefined;
    },
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Please provide emergency contact details for ${formData.firstName}. This person will be contacted if we cannot reach ${formData.firstName} directly.` :
          "Please provide emergency contact details for the patient. This person will be contacted if we cannot reach the patient directly.";
      }
      return "Please provide details of someone we can contact in case of an emergency.";
    },
    shouldShowContinue: true,
    fields: [
      {
        type: 'text',
        field: 'nokName',
        label: 'Emergency contact name *',
        placeholder: 'Full name',
        required: true
      },
      {
        type: 'select',
        field: 'nokRelationship',
        label: 'Relationship *',
        placeholder: 'Select relationship',
        options: [
          'Parent',
          'Child',
          'Spouse/Partner',
          'Sibling',
          'Grandparent',
          'Friend',
          'Carer',
          'Other Family Member',
          'Other'
        ],
        required: true
      },
      {
        type: 'tel',
        field: 'nokContact',
        label: 'Contact number *',
        placeholder: '04XX XXX XXX',
        required: true
      }
    ],
    skipIf: (formData: RegistrationData) =>
      formData.isThirdParty === 'For someone else' &&
      formData.useRegistrantAsEmergencyContact === 'Yes'
  }
]; 