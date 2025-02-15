import { RegistrationStep, RegistrationData } from '../types/index';

export const registrantSteps: RegistrationStep[] = [
  {
    id: 'isThirdParty',
    question: 'Are you registering for yourself or someone else?',
    field: 'isThirdParty',
    type: 'select',
    options: ['For myself', 'For someone else'],
    validation: (value: string) => {
      if (!value) return 'Please select an option';
      return undefined;
    },
    skipIf: (formData: RegistrationData) => formData.isThirdParty === 'For myself',
    placeholder: 'Select an option'
  },
  {
    id: 'registrantName',
    question: 'What is your full name?',
    field: 'registrantName',
    type: 'text',
    validation: (value: string) => value ? undefined : 'Please enter your name',
    skipIf: (formData: RegistrationData) => formData.isThirdParty === 'For myself',
    placeholder: 'Your full name'
  },
  {
    id: 'registrantRelationship',
    question: 'What is your relationship to the patient?',
    field: 'registrantRelationship',
    type: 'text',
    validation: (value: string) => value ? undefined : 'Please specify your relationship to the patient',
    skipIf: (formData: RegistrationData) => formData.isThirdParty === 'For myself',
    placeholder: 'e.g., Parent, Spouse, Carer'
  },
  {
    id: 'registrantContact',
    question: 'What is your contact number?',
    field: 'registrantContact',
    type: 'tel',
    validation: (value: string) => /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04[0-9]{8}',
    skipIf: (formData: RegistrationData) => formData.isThirdParty === 'For myself',
    placeholder: '04XX XXX XXX'
  },
  {
    id: 'hasAuthority',
    question: (formData: RegistrationData) => {
      return `Do you have authority to make healthcare decisions for ${
        formData.firstName || 'the patient'
      }?`;
    },
    field: 'hasAuthority',
    type: 'radio',
    validation: (value: string) => {
      if (value === undefined || value === '') return 'Please answer this question';
      if (value === 'false') return 'You must have authority to make healthcare decisions to proceed';
      return undefined;
    },
    skipIf: (formData: RegistrationData) => formData.isThirdParty === 'For myself',
    helpText: (formData: RegistrationData) => {
      return `This means you are either a legal guardian, have power of attorney, or are otherwise legally authorized to make healthcare decisions for ${
        formData.firstName || 'the patient'
      }.`;
    }
  }
]; 