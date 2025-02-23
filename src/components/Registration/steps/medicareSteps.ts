import { RegistrationStep, RegistrationData } from '../types/index';
import { MedicareForm } from '../components/Medicare/MedicareForm';

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
    validation: (value: string | RegistrationData, formData?: RegistrationData, currentInputs?: Partial<RegistrationData>) => {
      // Only validate on form submission
      if (!formData) return undefined;
      
      // Combine currentInputs with formData, preferring currentInputs
      const data = {
        ...formData,
        ...(currentInputs || {}),
        // If value is a string, it's the Medicare number being validated
        ...(typeof value === 'string' ? { medicareNumber: value } : value)
      } as RegistrationData;

      console.log('Medicare validation:', {
        value,
        formData,
        currentInputs,
        data,
        medicareNumber: data?.medicareNumber,
        medicareIRN: data?.medicareIRN,
        medicareExpiry: data?.medicareExpiry
      });

      // Check Medicare number
      if (!data?.medicareNumber) {
        return 'Please enter the Medicare number';
      }
      if (!/^\d{10}$/.test(data.medicareNumber)) {
        return 'Medicare number must be 10 digits';
      }

      // Check IRN - use currentInputs.medicareIRN if available
      const irn = currentInputs?.medicareIRN || data.medicareIRN;
      if (!irn) {
        console.log('IRN validation failed:', { irn, currentInputs });
        return 'Please enter the IRN';
      }
      if (!/^[1-9]$/.test(irn)) {
        return 'IRN must be a single digit between 1-9';
      }

      // Check expiry date
      const expiry = currentInputs?.medicareExpiry || data.medicareExpiry;
      if (!expiry) {
        return 'Please enter the expiry date';
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return 'Expiry date must be in MM/YY format';
      }
      
      const [month, year] = expiry.split('/');
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
    validation: (value) => value ? undefined : 'Please select your Medicare eligibility status',
    helpText: "This helps us understand your healthcare coverage options",
    // Only show this question if they selected 'Continue without Medicare'
    skipIf: (formData: RegistrationData) => 
      formData.medicareChoice !== 'without-medicare'
  }
]; 