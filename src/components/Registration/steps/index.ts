import { RegistrationStep, RegistrationData } from '../types/index';
import { registrantSteps } from './registrantSteps';
import { medicareSteps } from './medicareSteps';
import { personalInfoSteps } from './personalInfoSteps';
import { symptomSteps } from './symptomSteps';
import { contactSteps } from './contactSteps';
import { addressSteps } from './addressSteps';
import { emergencyContactSteps } from './emergencyContactSteps';
import { gpSteps } from './gpSteps';
import { culturalSteps } from './culturalSteps';

// Initial step to determine registration type
const initialStep: RegistrationStep = {
  id: 'registrationType',
  question: "Are you completing this registration for yourself or for someone else?",
  field: 'isThirdParty',
  type: 'select',
  options: ['For myself', 'For someone else'],
  validation: (value: string | RegistrationData, formData?: RegistrationData) => {
    if (!value) return 'Please select who you are registering';
    return undefined;
  },
  helpText: "This helps us tailor the registration process appropriately"
};

// Combine all steps in the correct order
export const registrationSteps: RegistrationStep[] = [
  initialStep,
  ...registrantSteps,      // Registration context (if registering for someone else)
  ...medicareSteps,        // Medicare details (following welcome screen)
  ...personalInfoSteps,    // Basic personal information
  ...symptomSteps,         // Medical need
  ...contactSteps,         // Contact details
  ...addressSteps,         // Address information
  ...emergencyContactSteps, // Support network
  ...gpSteps,              // GP information
  ...culturalSteps         // Healthcare context
]; 