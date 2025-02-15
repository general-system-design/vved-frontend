export interface RegistrationData {
  // Registration context
  isThirdParty: 'For myself' | 'For someone else' | '';
  registrantRelationship?: string;
  registrantName?: string;
  registrantContact?: string;
  hasAuthority: boolean;
  useRegistrantAsEmergencyContact?: 'Yes' | 'No';

  // Patient details
  title: string;
  firstName: string;
  lastName: string;
  medicareNumber: string;
  hasMedicareCard: 'Yes' | 'No' | '';
  dateOfBirth: string;
  countryOfBirth: string;
  phone: string;
  phoneVerificationCode: string;
  email: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  otherLanguages: string[];
  needsInterpreter: boolean;
  religion?: string;
  indigenousStatus: string;

  // Symptoms
  symptoms: string;
  symptomDuration: string;
  painLevel: string;

  // Residential Address
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;

  // Current Location (if different from residential)
  isCurrentLocationDifferent: boolean | null;
  currentStreetAddress?: string;
  currentSuburb?: string;
  currentState?: string;
  currentPostcode?: string;

  // Other details
  gpName?: string;
  gpClinic?: string;
  gpAddress?: string;
  nokName: string;
  nokRelationship: string;
  nokContact: string;
}

export interface RegistrationStep {
  id: string;
  question: string | ((formData: RegistrationData) => string);
  field: keyof RegistrationData;
  type: 'text' | 'tel' | 'date' | 'email' | 'select' | 'boolean' | 'radio' | 'textarea';
  validation?: (value: string) => string | undefined;
  options?: string[];
  pattern?: string;
  helpText?: string | ((formData: RegistrationData) => string);
  followUpQuestion?: (value: string) => string | undefined;
  skipIf?: (formData: RegistrationData) => boolean;
  skipQuestion?: boolean;
  placeholder?: string;
  shouldShowContinue?: boolean;
}

export const initialRegistrationData: RegistrationData = {
  isThirdParty: '',
  hasAuthority: false,
  title: '',
  firstName: '',
  lastName: '',
  medicareNumber: '',
  hasMedicareCard: '',
  dateOfBirth: '',
  countryOfBirth: '',
  phone: '',
  phoneVerificationCode: '',
  email: '',
  preferredContactMethod: '',
  preferredLanguage: 'English',
  otherLanguages: [],
  needsInterpreter: false,
  religion: '',
  indigenousStatus: '',
  symptoms: '',
  symptomDuration: '',
  painLevel: '',
  streetAddress: '',
  suburb: '',
  state: '',
  postcode: '',
  isCurrentLocationDifferent: null,
  gpName: '',
  gpClinic: '',
  gpAddress: '',
  nokName: '',
  nokRelationship: '',
  nokContact: ''
}; 