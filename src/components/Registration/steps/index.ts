import { RegistrationStep } from '../types/index';
import { registrantSteps } from './registrantSteps';
import { personalInfoSteps } from './personalInfoSteps';
import { symptomSteps } from './symptomSteps';
import { medicareSteps } from './medicareSteps';
import { contactSteps } from './contactSteps';
import { culturalSteps } from './culturalSteps';
import { addressSteps } from './addressSteps';
import { gpSteps } from './gpSteps';
import { emergencyContactSteps } from './emergencyContactSteps';

// Initial step to determine registration type
const initialStep: RegistrationStep = {
  id: 'registrationType',
  question: "Are you completing this registration for yourself or for someone else?",
  field: 'isThirdParty',
  type: 'select',
  options: ['For myself', 'For someone else'],
  validation: (value: string) => {
    if (!value) return 'Please select who you are registering';
    return undefined;
  },
  helpText: "This helps us tailor the registration process appropriately"
};

// Combine all steps in the correct order
export const registrationSteps: RegistrationStep[] = [
  initialStep,
  ...registrantSteps,
  ...personalInfoSteps,
  ...symptomSteps,
  ...culturalSteps,
  ...medicareSteps,
  ...contactSteps,
  ...addressSteps,
  ...gpSteps,
  ...emergencyContactSteps
]; 