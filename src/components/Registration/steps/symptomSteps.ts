import { RegistrationStep, RegistrationData } from '../types/index';

export const symptomSteps: RegistrationStep[] = [
  {
    id: 'symptoms',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Tell us about ${formData.firstName}'s symptoms` :
          "Tell us about the patient's symptoms";
      }
      return "Tell us about your symptoms";
    },
    field: 'mainConcern',
    type: 'multifield',
    validation: (value: string | RegistrationData) => {
      if (typeof value !== 'string' || !value?.trim()) return 'Please describe your main concern';
      return undefined;
    },
    shouldShowContinue: true,
    fields: [
      {
        type: 'text',
        field: 'mainConcern',
        label: 'Main concern or symptom *',
        placeholder: 'e.g. Chest pain, difficulty breathing, severe headache',
        helpText: "Please be specific about your main symptom or concern",
        required: true
      },
      {
        type: 'textarea',
        field: 'additionalDetails',
        label: 'Additional details',
        placeholder: 'e.g. When it started, what makes it better/worse, related symptoms',
        helpText: "This information helps us better understand your condition (optional)",
        required: false
      }
    ]
  }
]; 