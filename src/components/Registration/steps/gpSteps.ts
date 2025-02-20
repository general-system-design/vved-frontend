import { RegistrationStep, RegistrationData } from '../types/index';
import { GPData, searchGPs, loadGPData } from '../../../utils/gpDataLoader';

export const gpSteps: RegistrationStep[] = [
  {
    id: 'gpName',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Who is ${formData.firstName}'s regular GP?` :
          "Who is the patient's regular GP?";
      }
      return "Who is your regular GP?";
    },
    field: 'gpName',
    type: 'custom',
    validation: (value: string | RegistrationData, formData?: RegistrationData) => {
      if (typeof value !== 'string' || !value?.trim()) return 'Please enter your GP name';
      return undefined;
    },
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Search for ${formData.firstName}'s regular doctor by name or location` :
          "Search for the patient's regular doctor by name or location";
      }
      return "Search for your regular doctor by name or location";
    },
    placeholder: "Start typing to search for your GP",
    onSearch: async (query: string) => {
      await loadGPData(); // Ensure data is loaded
      return searchGPs(query);
    },
    formatSearchResult: (gp: GPData) => ({
      label: `${gp.HEORG_REFERENCE} - ${gp.HealthOrgPostal_Address_Suburb}, ${gp.Postal_State}`,
      value: gp.HEORG_REFERENCE,
      details: gp
    })
  },
  {
    id: 'gpClinic',
    question: "What's the name of their medical clinic?",
    field: 'gpClinic',
    type: 'text',
    validation: (value: string | RegistrationData, formData?: RegistrationData) => {
      if (typeof value !== 'string' || !value?.trim()) return 'Please enter the clinic name';
      return undefined;
    },
    placeholder: 'Medical clinic name'
  },
  {
    id: 'gpAddress',
    question: "What's the clinic's address?",
    field: 'gpAddress',
    type: 'text',
    validation: (value: string | RegistrationData, formData?: RegistrationData) => {
      if (typeof value !== 'string' || !value?.trim()) return 'Please enter the clinic address';
      return undefined;
    },
    placeholder: 'Clinic address'
  }
]; 