export interface RegistrationData {
  // Registration context
  isThirdParty?: string;
  registrantRelationship?: string;
  registrantName?: string;
  registrantContact?: string;
  hasAuthority?: boolean;
  useRegistrantAsEmergencyContact?: 'Yes' | 'No';

  // Patient details
  title: string;
  firstName?: string;
  lastName: string;
  medicareChoice?: 'with-medicare' | 'without-medicare' | 'not-eligible';
  hasMedicareCard: 'Yes' | 'No' | '';
  medicareNumber: string;
  medicareIRN: string;
  medicareExpiry: string;
  medicareEligibility: 'yes' | 'no' | 'unsure' | '';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  countryOfBirth: string;
  phone: string;
  phoneVerificationCode: string;
  email: string;
  preferredContactMethod: string;
  preferredLanguage: string;
  otherLanguages?: string[];
  needsInterpreter?: boolean;
  religion?: string;
  indigenousStatus: string;

  // Symptoms
  mainConcern: string;
  additionalDetails: string;

  // Residential Address
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;

  // Current Location (if different from residential)
  isCurrentLocationDifferent?: boolean | null;
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

  [key: string]: string | string[] | boolean | null | undefined;
}

export interface SearchResult {
  label: string;
  value: string;
  details: any;
}

interface FieldConfig {
  type: 'text' | 'tel' | 'date' | 'email' | 'select' | 'boolean' | 'radio' | 'textarea';
  field: keyof RegistrationData;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: string[] | Array<{ value: string; label: string }>;
}

export interface RegistrationStep {
  id: string;
  question: string | ((formData: RegistrationData) => string);
  field: string;
  type: 'text' | 'tel' | 'date' | 'email' | 'select' | 'boolean' | 'radio' | 'textarea' | 'custom' | 'multifield';
  validation: (value: string | RegistrationData, formData?: RegistrationData) => string | undefined;
  options?: string[] | Array<{ value: string; label: string }>;
  pattern?: string;
  maxLength?: number;
  layout?: 'inline-3' | 'inline-2' | 'stacked';
  label?: string;
  isDateField?: boolean;
  helpText?: string | ((formData: RegistrationData) => string);
  followUpQuestion?: (value: string) => string | undefined;
  skipIf?: (formData: RegistrationData) => boolean;
  skipQuestion?: boolean;
  placeholder?: string;
  shouldShowContinue?: boolean;
  component?: React.ComponentType<any>;
  fields?: FieldConfig[];
  onSearch?: (query: string) => Promise<any[]>;
  formatSearchResult?: (result: any) => SearchResult;
}

export const initialRegistrationData: RegistrationData = {
  isThirdParty: '',
  hasAuthority: false,
  title: '',
  firstName: '',
  lastName: '',
  medicareChoice: undefined,
  hasMedicareCard: '',
  medicareNumber: '',
  medicareIRN: '',
  medicareExpiry: '',
  medicareEligibility: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
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
  mainConcern: '',
  additionalDetails: '',
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