import React from 'react';
import { MedicareFormProps, MedicareValidation, MedicareData } from '../../types/medicare';
import { MedicareInput } from './MedicareInput';
import {
  FormContainer,
  SmallInput,
  Label,
  ErrorText,
  HelpText,
  InputSection,
  SmallInputsRow,
} from './MedicareForm.styles';

// Add currentInputs to MedicareFormProps
interface ExtendedMedicareFormProps extends MedicareFormProps {
  currentInputs?: Partial<MedicareData>;
}

export const MedicareForm: React.FC<ExtendedMedicareFormProps> = ({
  formData,
  currentInputs,
  onInputChange,
  error,
  isTransitioning
}) => {
  // Add refs for IRN and expiry inputs
  const irnInputRef = React.useRef<HTMLInputElement>(null);
  const expiryInputRef = React.useRef<HTMLInputElement>(null);

  console.log('MedicareForm render:', {
    formData,
    currentInputs,
    error,
    isTransitioning,
    hasIRN: !!formData.medicareIRN,
    irnValue: formData.medicareIRN,
    currentIRN: currentInputs?.medicareIRN
  });

  // Helper to get current value, preferring currentInputs over formData
  const getValue = (field: keyof MedicareData): string => {
    const currentValue = currentInputs?.[field]?.toString();
    const formValue = formData[field]?.toString();
    const result = currentValue || formValue || '';
    console.log('getValue called:', { field, currentValue, formValue, result });
    return result;
  };

  // Wrap onInputChange to add logging and focus management
  const handleInputChange = (field: keyof MedicareData, value: string) => {
    console.log('handleInputChange called:', { field, value });
    onInputChange(field, value);

    // Auto-focus logic
    if (field === 'medicareNumber' && value.length === 10) {
      // If Medicare number is complete (10 digits), focus IRN
      setTimeout(() => irnInputRef.current?.focus(), 50);
    } else if (field === 'medicareIRN' && /^[1-9]$/.test(value)) {
      // If IRN is valid (single digit 1-9), focus expiry
      setTimeout(() => expiryInputRef.current?.focus(), 50);
    }
  };

  // Validation functions
  const validateMedicareNumber = (value: string): MedicareValidation => {
    if (!value) return { isValid: false, error: 'Medicare number is required' };
    if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return { isValid: false, error: 'Medicare number must be 10 digits' };
    return { isValid: true };
  };

  const validateIRN = (value: string): MedicareValidation => {
    if (!value) return { isValid: false, error: 'IRN is required' };
    if (!/^[1-9]$/.test(value)) return { isValid: false, error: 'IRN must be a single digit between 1-9' };
    return { isValid: true };
  };

  const validateExpiry = (value: string): MedicareValidation => {
    if (!value) return { isValid: false, error: 'Expiry date is required' };
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 4) return { isValid: false, error: 'Expiry date must be in MM/YY format' };
    
    const month = parseInt(digits.slice(0, 2));
    const year = parseInt(`20${digits.slice(2)}`);
    const expiryDate = new Date(year, month - 1);
    const currentDate = new Date();
    
    if (month < 1 || month > 12) return { isValid: false, error: 'Invalid month' };
    if (expiryDate < currentDate) return { isValid: false, error: 'Medicare card has expired' };
    
    return { isValid: true };
  };

  // Get and log current values
  const medicareNumber = getValue('medicareNumber');
  const medicareIRN = getValue('medicareIRN');
  const medicareExpiry = getValue('medicareExpiry');

  console.log('Current field values:', {
    medicareNumber,
    medicareIRN,
    medicareExpiry
  });

  return (
    <FormContainer>
      <MedicareInput
        value={medicareNumber}
        onChange={(value) => {
          console.log('MedicareInput onChange:', { value });
          handleInputChange('medicareNumber', value);
        }}
        error={validateMedicareNumber(medicareNumber).error}
        isTransitioning={isTransitioning}
        label="Medicare Number"
        required={true}
        helpText="Enter your Medicare card number"
      />

      <SmallInputsRow>
        <div>
          <Label>
            IRN<span style={{ color: '#dc3545' }}> *</span>
          </Label>
          <SmallInput
            ref={irnInputRef}
            type="text"
            value={medicareIRN}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              console.log('IRN onChange:', { rawValue: e.target.value, processedValue: value });
              if (value === '' || /^[1-9]$/.test(value)) {
                handleInputChange('medicareIRN', value);
              }
            }}
            placeholder="X"
            hasError={!!validateIRN(medicareIRN).error}
            disabled={isTransitioning}
            aria-label="IRN (Individual Reference Number)"
            aria-required={true}
            maxLength={1}
          />
          {validateIRN(medicareIRN).error && validateIRN(medicareIRN).error !== error && (
            <ErrorText role="alert">
              {validateIRN(medicareIRN).error}
            </ErrorText>
          )}
          <HelpText>Individual Reference Number (IRN)</HelpText>
        </div>

        <div>
          <Label>
            Expiry Date<span style={{ color: '#dc3545' }}> *</span>
          </Label>
          <SmallInput
            ref={expiryInputRef}
            type="text"
            value={medicareExpiry}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              console.log('Expiry onChange:', { 
                rawValue: e.target.value, 
                digits,
                currentLength: digits.length 
              });
              if (digits.length <= 4) {
                let formattedValue = digits;
                if (digits.length > 2) {
                  formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                }
                console.log('Expiry updating to:', formattedValue);
                handleInputChange('medicareExpiry', formattedValue);
              }
            }}
            placeholder="MM/YY"
            hasError={!!validateExpiry(medicareExpiry).error}
            disabled={isTransitioning}
            aria-label="Expiry Date"
            aria-required={true}
            width="100px"
            maxLength={5}
          />
          {validateExpiry(medicareExpiry).error && (
            <ErrorText role="alert">
              {validateExpiry(medicareExpiry).error}
            </ErrorText>
          )}
          <HelpText>Card expiry date (MM/YY)</HelpText>
        </div>
      </SmallInputsRow>

      {error && (
        <ErrorText role="alert" style={{ marginTop: '1rem' }}>
          {error}
        </ErrorText>
      )}
    </FormContainer>
  );
}; 