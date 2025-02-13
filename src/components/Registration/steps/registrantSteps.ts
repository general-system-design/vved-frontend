import { RegistrationStep } from '../types';

export const registrantSteps: RegistrationStep[] = [
  {
    id: 'registrantName',
    question: "What is your full name?",
    field: 'registrantName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter your full name';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return undefined;
    },
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: "We'll need this for our records and to verify your authority"
  },
  {
    id: 'registrantRelationship',
    question: "What is your relationship to the patient?",
    field: 'registrantRelationship',
    type: 'select',
    options: [
      'Parent/Guardian',
      'Spouse/Partner',
      'Adult Child',
      'Sibling',
      'Legal Representative',
      'Professional Carer',
      'Support Worker',
      'Other Family Member',
      'Other'
    ],
    validation: (value) => value ? undefined : 'Please specify your relationship to the patient',
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: "This helps us understand your connection to the patient"
  },
  {
    id: 'registrantContact',
    question: "What's the best number to reach you on?",
    field: 'registrantContact',
    type: 'tel',
    validation: (value) => /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: "We may need to contact you about this registration or for additional information"
  },
  {
    id: 'authority',
    question: (formData) => {
      if (formData.registrantRelationship === 'Parent/Guardian') {
        return "Are you the legal guardian or have parental responsibility?";
      }
      if (formData.registrantRelationship === 'Legal Representative') {
        return "Do you have legal authority (e.g., Power of Attorney) to act on behalf of the patient?";
      }
      return "Do you have the authority to provide medical information on behalf of the patient?";
    },
    field: 'hasAuthority',
    type: 'select',
    options: ['Yes', 'No'],
    validation: (value) => {
      if (value === 'No') {
        return 'You need legal authority to register on behalf of someone else. Please have the patient complete the registration or provide proof of authority.';
      }
      return undefined;
    },
    skipIf: (formData) => formData.isThirdParty === 'For myself',
    helpText: (formData) => {
      if (formData.registrantRelationship === 'Parent/Guardian') {
        return "This confirms you have the legal right to make healthcare decisions for the patient";
      }
      if (formData.registrantRelationship === 'Legal Representative') {
        return "This could be through Power of Attorney, Guardianship, or other legal documentation";
      }
      return "You must have the legal authority to provide medical information and make healthcare decisions";
    }
  }
]; 