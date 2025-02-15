import { RegistrationStep, RegistrationData } from '../types/index';

export const contactSteps: RegistrationStep[] = [
  {
    id: 'contactDetails',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ? 
          `What are ${formData.firstName}'s contact details?` :
          "What are the patient's contact details?";
      }
      return "What are your contact details?";
    },
    field: 'phone',
    type: 'tel',
    validation: (value: string) => 
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    placeholder: 'Mobile number',
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This will be used for ${formData.firstName}'s future communications` :
          "This will be used for the patient's future communications";
      }
      return "We'll use this for important communications and verification";
    }
  },
  {
    id: 'email',
    question: "",
    field: 'email',
    type: 'email',
    validation: (value: string) => {
      if (!value) return undefined; // Optional field
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : 'Please enter a valid email address';
    },
    placeholder: 'Email address (optional)',
    skipQuestion: true,
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `We'll use this to send important information about ${formData.firstName}'s care` :
          "We'll use this to send important information about their care";
      }
      return "We'll use this to send important information about your care";
    }
  },
  {
    id: 'preferredContactMethod',
    question: "",
    field: 'preferredContactMethod',
    type: 'select',
    options: ['Mobile Phone', 'Email'],
    validation: (value: string) => value ? undefined : 'Please select a preferred contact method',
    skipIf: (formData: RegistrationData) => !formData.email, // Skip if no email provided
    skipQuestion: true,
    placeholder: 'Preferred contact method',
    helpText: "How would you like us to contact you for non-urgent matters?"
  },
  {
    id: 'registrantVerification',
    question: (formData) => `Please enter the verification code sent to ${formData.registrantContact}`,
    field: 'phoneVerificationCode',
    type: 'tel',
    validation: (value: string) => 
      /^\d{6}$/.test(value) ? undefined : 'Please enter the 6-digit verification code',
    pattern: '\\d{6}',
    placeholder: '6-digit code',
    helpText: "We've sent a 6-digit code to verify your identity as the registrant",
    skipIf: (formData) => formData.isThirdParty !== 'For someone else'
  },
  {
    id: 'patientVerification',
    question: (formData) => `Please enter the verification code sent to ${formData.phone}`,
    field: 'phoneVerificationCode',
    type: 'tel',
    validation: (value: string) => 
      /^\d{6}$/.test(value) ? undefined : 'Please enter the 6-digit verification code',
    pattern: '\\d{6}',
    placeholder: '6-digit code',
    helpText: "We've sent a 6-digit code to verify your mobile number",
    skipIf: (formData) => formData.isThirdParty === 'For someone else'
  }
]; 