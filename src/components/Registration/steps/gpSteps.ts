import { RegistrationStep } from '../types';

export const gpSteps: RegistrationStep[] = [
  {
    id: 'gpDetails',
    question: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Who is ${formData.firstName}'s regular GP?` :
          "Who is the patient's regular GP?";
      }
      return "Who is your regular GP?";
    },
    field: 'gpName',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter GP name';
      return undefined;
    },
    placeholder: "GP's full name",
    helpText: (formData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `This helps us coordinate ${formData.firstName}'s care with their regular doctor` :
          "This helps us coordinate the patient's care with their regular doctor";
      }
      return "This helps us coordinate your care with your regular doctor";
    }
  },
  {
    id: 'gpClinic',
    question: "",
    field: 'gpClinic',
    type: 'text',
    validation: (value) => {
      if (!value?.trim()) return 'Please enter clinic name';
      return undefined;
    },
    placeholder: "Medical clinic name",
    skipQuestion: true
  },
  {
    id: 'gpAddress',
    question: "",
    field: 'gpAddress',
    type: 'select',
    options: [
      '123 Medical Centre, Sydney NSW 2000',
      '456 Family Practice, Melbourne VIC 3000',
      '789 Health Hub, Brisbane QLD 4000'
    ],
    validation: (value) => {
      if (!value) return 'Please select or enter clinic address';
      return undefined;
    },
    placeholder: "Search for clinic address",
    skipQuestion: true
  }
]; 