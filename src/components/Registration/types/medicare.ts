export interface MedicareData {
  hasMedicareCard: 'Yes' | 'No' | '';
  medicareNumber: string;
  medicareIRN: string;
  medicareExpiry: string;
  medicareCardImage?: string;
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

export interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export interface OcrResult {
  medicareNumber?: string;
  medicareIRN?: string;
  medicareExpiry?: string;
  confidence: number;
  rawText: string;
}

export interface CapturePreviewProps {
  imageData: string;
  ocrResult?: OcrResult;
  onConfirm: () => void;
  onRetry: () => void;
  isProcessing: boolean;
}

export interface OcrFeedbackProps {
  status: string;
  confidence?: number;
  isProcessing: boolean;
} 