export interface MedicareData {
  hasMedicareCard: 'Yes' | 'No' | '';
  medicareNumber: string;
  medicareIRN: string;
  medicareExpiry: string;
}

export interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onError?: (error: Error) => void;
  onClose: () => void;
  isOpen: boolean;
}

export interface OcrResult {
  medicareNumber: string;
  medicareIRN: string;
  medicareExpiry: string;
  confidence: number;
  rawText: string;
}

export interface MedicareFormProps {
  formData: MedicareData;
  onInputChange: (field: keyof MedicareData, value: string) => void;
  error?: string;
  isTransitioning?: boolean;
}

export interface MedicareInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isTransitioning?: boolean;
  placeholder?: string;
  label: string;
  helpText?: string;
  required?: boolean;
}

export interface MedicareValidation {
  isValid: boolean;
  error?: string;
} 