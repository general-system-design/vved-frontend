import { RegistrationStep } from '../types';

export const contactSteps: RegistrationStep[] = [
  {
    id: 'phone',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ? 
          `What is ${formData.firstName}'s mobile number?` :
          "What is the patient's mobile number?";
      }
      return "What's your mobile number?";
    },
    field: 'phone',
    type: 'tel',
    validation: (value) => 
      /^04\d{8}$/.test(value) ? undefined : 'Please enter a valid Australian mobile number',
    pattern: '04\\d{8}',
    placeholder: 'Mobile number',
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This will be used for ${formData.firstName}'s future communications` :
          "This will be used for the patient's future communications";
      }
      return "We'll use this for important communications and verification";
    }
  },
  {
    id: 'registrantVerification',
    question: (formData) => `Please enter the verification code sent to ${formData.registrantContact}`,
    field: 'phoneVerificationCode',
    type: 'tel',
    validation: (value) => 
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
    validation: (value) => 
      /^\d{6}$/.test(value) ? undefined : 'Please enter the 6-digit verification code',
    pattern: '\\d{6}',
    placeholder: '6-digit code',
    helpText: "We've sent a 6-digit code to verify your mobile number",
    skipIf: (formData) => formData.isThirdParty === 'For someone else'
  },
  {
    id: 'email',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What is ${formData.firstName}'s email address? (optional)` :
          "What is the patient's email address? (optional)";
      }
      return "What's your email address? (optional)";
    },
    field: 'email',
    type: 'email',
    validation: (value) => {
      if (!value) return undefined; // Optional field
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : 'Please enter a valid email address';
    },
    placeholder: 'Email address',
    helpText: (formData) => {
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
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `What's ${formData.firstName}'s preferred contact method?` :
          "What's the patient's preferred contact method?";
      }
      return "What's your preferred contact method?";
    },
    field: 'preferredContactMethod',
    type: 'select',
    options: ['Mobile Phone', 'Email'],
    validation: (value) => value ? undefined : 'Please select a preferred contact method',
    skipIf: (formData) => !formData.email, // Skip if no email provided
    helpText: "How would you like us to contact you for non-urgent matters?"
  }
]; 