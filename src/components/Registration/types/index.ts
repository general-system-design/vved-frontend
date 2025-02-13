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
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  useCurrentLocation: boolean;
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
  type: 'text' | 'tel' | 'date' | 'email' | 'select' | 'boolean';
  validation?: (value: string) => string | undefined;
  options?: string[];
  placeholder?: string;
  pattern?: string;
  helpText?: string | ((formData: RegistrationData) => string);
  followUpQuestion?: (value: string) => string | undefined;
  skipIf?: (formData: RegistrationData) => boolean;
  skipQuestion?: boolean;
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
  streetAddress: '',
  suburb: '',
  state: '',
  postcode: '',
  useCurrentLocation: false,
  gpName: '',
  gpClinic: '',
  gpAddress: '',
  nokName: '',
  nokRelationship: '',
  nokContact: ''
}; 