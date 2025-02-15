import { RegistrationStep, RegistrationData } from '../types/index';

export const symptomSteps: RegistrationStep[] = [
  {
    id: 'symptoms',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Please describe ${formData.firstName}'s current symptoms or reason for visit` :
          "Please describe the patient's current symptoms or reason for visit";
      }
      return "Please describe your current symptoms or reason for visit";
    },
    field: 'symptoms',
    type: 'textarea',
    validation: (value: string) => {
      if (!value?.trim()) return 'Please provide a description of the symptoms';
      if (value.trim().length < 10) return 'Please provide more detail about the symptoms';
      return undefined;
    },
    placeholder: 'Describe your symptoms and when they started',
    helpText: "This helps us understand your needs and prioritize care appropriately"
  },
  {
    id: 'symptomDuration',
    question: "When did these symptoms start?",
    field: 'symptomDuration',
    type: 'select',
    options: [
      'Today',
      'Yesterday',
      'In the last week',
      'In the last month',
      'More than a month ago'
    ],
    validation: (value: string) => value ? undefined : 'Please select when the symptoms started',
    helpText: "This information helps us assess the urgency of your condition"
  },
  {
    id: 'painLevel',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `On a scale of 0-10, how would you rate ${formData.firstName}'s current pain level?` :
          "On a scale of 0-10, how would you rate the patient's current pain level?";
      }
      return "On a scale of 0-10, how would you rate your current pain level?";
    },
    field: 'painLevel',
    type: 'select',
    options: [
      '0 - No pain',
      '1-2 - Mild pain',
      '3-4 - Moderate pain',
      '5-6 - Strong pain',
      '7-8 - Very strong pain',
      '9-10 - Worst possible pain',
      'Not applicable'
    ],
    validation: (value: string) => value ? undefined : 'Please select a pain level',
    helpText: "0 means no pain, 10 means the worst pain imaginable"
  }
]; 