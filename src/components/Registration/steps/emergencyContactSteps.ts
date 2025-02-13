import { RegistrationStep } from '../types';

export const emergencyContactSteps: RegistrationStep[] = [
  {
    id: 'useRegistrantAsEmergencyContact',
    question: (formData) => formData.firstName ?
      `Would you like to be listed as ${formData.firstName}'s emergency contact?` :
      "Would you like to be listed as the patient's emergency contact?",
    field: 'useRegistrantAsEmergencyContact',
    type: 'select',
    options: ['Yes', 'No'],
    skipIf: (formData) => formData.isThirdParty !== 'For someone else',
    helpText: "As the person registering the patient, you can be set as their emergency contact"
  },
  {
    id: 'emergencyContact',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Besides yourself, who else should we contact in case of an emergency with ${formData.firstName}?` :
          "Besides yourself, who else should we contact in case of emergency?";
      }
      return "Who should we contact in case of emergency?";
    },
    field: 'nokName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter a name';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    placeholder: "Emergency contact's name",
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This should be someone other than yourself who can be contacted in an emergency regarding ${formData.firstName}` :
          "This should be someone other than yourself who can be contacted in an emergency";
      }
      return "This should be someone we can contact if we can't reach you";
    },
    skipIf: (formData) => 
      formData.isThirdParty === 'For someone else' && 
      formData.useRegistrantAsEmergencyContact === 'Yes'
  },
  {
    id: 'nokRelationship',
    question: "",
    field: 'nokRelationship',
    type: 'select',
    options: [
      'Parent/Guardian',
      'Spouse/Partner',
      'Child',
      'Sibling',
      'Other Family Member',
      'Friend',
      'Neighbor',
      'Other'
    ],
    validation: (value) => value ? undefined : 'Please specify the relationship',
    placeholder: 'Their relationship to the patient',
    skipQuestion: true,
    skipIf: (formData) => 
      formData.isThirdParty === 'For someone else' && 
      formData.useRegistrantAsEmergencyContact === 'Yes'
  },
  {
    id: 'nokContact',
    question: "",
    field: 'nokContact',
    type: 'tel',
    validation: (value) => 
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    placeholder: 'Their mobile number',
    skipQuestion: true,
    skipIf: (formData) => 
      formData.isThirdParty === 'For someone else' && 
      formData.useRegistrantAsEmergencyContact === 'Yes'
  }
]; 