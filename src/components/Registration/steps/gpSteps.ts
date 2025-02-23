import { RegistrationStep, RegistrationData } from '../types/index';
import { GPData, searchGPs, loadGPData } from '../../../utils/gpDataLoader';
import { GPSearch } from '../components/GPSearch';

export const gpSteps: RegistrationStep[] = [
  {
    id: 'gpName',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Which medical clinic does ${formData.firstName} usually visit?` :
          "Which medical clinic does the patient usually visit?";
      }
      return "Which medical clinic do you usually visit?";
    },
    field: 'gpName',
    type: 'custom',
    component: GPSearch,
    validation: (value: string | RegistrationData) => {
      console.log('Validating GP value:', value); // Debug log
      if (typeof value !== 'string') return 'Please select a medical clinic';
      // Allow both MANUAL_ENTRY and any non-empty value for HEORG_REFERENCE
      if (!value?.trim()) {
        return 'Please select a medical clinic or enter details manually';
      }
      return undefined;
    },
    helpText: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Search for ${formData.firstName}'s regular medical clinic by name or location, or enter details manually if not found` :
          "Search for the patient's regular medical clinic by name or location, or enter details manually if not found";
      }
      return "Search for your regular medical clinic by name or location, or enter details manually if not found";
    },
    placeholder: "Start typing to search for your medical clinic",
    onSearch: async (query: string) => {
      await loadGPData(); // Ensure data is loaded
      return searchGPs(query);
    },
    formatSearchResult: (gp: GPData) => {
      console.log('Formatting GP result:', gp);
      
      // Build the clinic name
      const clinicName = gp.HealthOrg_Description?.trim() || gp.HEORG_REFNO;

      // Build the address parts, filtering out empty/undefined values
      const addressParts = [
        gp.Postal_Address,
        gp.Postal_Suburb,
        gp.Postal_State,
        gp.Postal_Postcode
      ].filter(part => part?.trim()).join(', ');

      // For manual entries, use the data as is
      if (gp.HEORG_REFNO === 'MANUAL_ENTRY') {
        const result = {
          label: `${gp.HealthOrg_Description} - ${gp.Postal_Address}`,
          value: 'MANUAL_ENTRY',
          details: gp
        };
        console.log('Formatted manual entry:', result);
        return result;
      }

      const result = {
        label: `${clinicName}${addressParts ? ` - ${addressParts}` : ''}`,
        value: gp.HEORG_REFNO,
        details: gp
      };
      console.log('Formatted search result:', result);
      return result;
    }
  }
]; 