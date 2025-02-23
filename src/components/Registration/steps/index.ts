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
  helpText: "This helps us tailor the registration process appropriately",
  section: "Registration Type"
};

// Add section information to each step group
const addSectionToSteps = (steps: RegistrationStep[], sectionName: string): RegistrationStep[] => {
  return steps.map(step => ({
    ...step,
    section: sectionName
  }));
};

// Combine all steps in the correct order with section information
export const registrationSteps: RegistrationStep[] = [
  initialStep,
  ...addSectionToSteps(registrantSteps, "Registrant Details"),
  ...addSectionToSteps(medicareSteps, "Medicare Information"),
  ...addSectionToSteps(personalInfoSteps, "Personal Information"),
  ...addSectionToSteps(symptomSteps, "Medical Need"),
  ...addSectionToSteps(contactSteps, "Contact Details"),
  ...addSectionToSteps(addressSteps, "Address Information"),
  ...addSectionToSteps(emergencyContactSteps, "Emergency Contact"),
  ...addSectionToSteps(gpSteps, "GP Information"),
  ...addSectionToSteps(culturalSteps, "Healthcare Context")
]; 