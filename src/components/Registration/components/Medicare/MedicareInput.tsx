import React from 'react';
import { MedicareInputProps } from '../../types/medicare';
import {
  InputGroup,
  Label,
  Input,
  ErrorText,
  HelpText,
} from './MedicareForm.styles';

export const MedicareInput: React.FC<MedicareInputProps> = ({
  value,
  onChange,
  error,
  isTransitioning,
  placeholder,
  label,
  helpText,
  required = true,
}) => {
  const formatMedicareNumber = (input: string): string => {
    // Remove any non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Apply Medicare number format (XXXX XXXXX X)
    const parts = [
      digits.slice(0, 4),
      digits.slice(4, 9),
      digits.slice(9, 10)
    ].filter(Boolean);

    return parts.join(' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Remove spaces and get only digits
    const numericValue = newValue.replace(/\D/g, '');
    // Limit to 10 digits
    const truncated = numericValue.slice(0, 10);
    onChange(truncated);
  };

  const displayValue = formatMedicareNumber(value);

  return (
    <InputGroup>
      <Label>
        {label}
        {required && <span style={{ color: '#dc3545' }}> *</span>}
      </Label>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder || 'XXXX XXXXX X'}
        hasError={!!error}
        disabled={isTransitioning}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
        maxLength={12} // 10 digits + 2 spaces
      />
      {error && (
        <ErrorText id={`${label}-error`} role="alert">
          {error}
        </ErrorText>
      )}
      {helpText && <HelpText>{helpText}</HelpText>}
    </InputGroup>
  );
}; 