import { RegistrationStep, RegistrationData } from '../types/index';
import { MedicareForm } from '../components/Medicare/MedicareForm';

// TODO: Remove this flag when OCR testing is complete
const TESTING_MODE = true;

export const medicareSteps: RegistrationStep[] = [
  {
    id: 'medicareDetails',
    question: (formData: RegistrationData) => {
      if (formData.isThirdParty === 'For someone else') {
        return formData.firstName ?
          `Please enter ${formData.firstName}'s Medicare card details` :
          "Please enter the patient's Medicare card details";
      }
      return "Please enter your Medicare card details";
    },
    field: 'medicareNumber',
    type: 'custom',
    component: MedicareForm,
    validation: (value: string | RegistrationData, formData?: RegistrationData) => {
      // Skip validation in testing mode
      if (TESTING_MODE) {
        console.debug('Medicare validation skipped - Testing Mode');
        return undefined;
      }

      const data = (typeof value === 'string' ? formData : value) as RegistrationData;
      if (!data?.medicareNumber) {
        return 'Please enter the Medicare number';
      }
      if (!/^\d{10}$/.test(data.medicareNumber)) {
        return 'Medicare number must be 10 digits';
      }
      if (!data.medicareIRN) {
        return 'Please enter the IRN';
      }
      if (!/^[1-9]$/.test(data.medicareIRN)) {
        return 'IRN must be a single digit between 1-9';
      }
      if (!data.medicareExpiry) {
        return 'Please enter the expiry date';
      }
      if (!/^\d{2}\/\d{2}$/.test(data.medicareExpiry)) {
        return 'Expiry date must be in MM/YY format';
      }
      
      const [month, year] = data.medicareExpiry.split('/');
      const monthNum = parseInt(month);
      if (monthNum < 1 || monthNum > 12) {
        return 'Invalid month in expiry date';
      }
      
      const currentDate = new Date();
      const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
      if (expiryDate < currentDate) {
        return 'Medicare card has expired';
      }
      
      return undefined;
    },
    // Skip Medicare details if they're not using Medicare or not eligible
    skipIf: (formData: RegistrationData) => 
      formData.medicareChoice === 'without-medicare' || 
      formData.medicareChoice === 'not-eligible'
  },
  {
    id: 'medicareEligibility',
    question: "Are you eligible for Medicare?",
    field: 'medicareEligibility',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: "I'm not sure" }
    ],
    helpText: "This helps us understand your healthcare coverage options",
    // Only show this question if they selected 'Continue without Medicare'
    skipIf: (formData: RegistrationData) => 
      formData.medicareChoice !== 'without-medicare'
  }
]; 