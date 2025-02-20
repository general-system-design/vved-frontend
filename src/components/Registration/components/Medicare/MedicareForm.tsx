import React, { useState, useEffect } from 'react';
import { MedicareFormProps, MedicareValidation, OcrResult } from '../../types/medicare';
import { MedicareInput } from './MedicareInput';
import { MedicareCapture } from './MedicareCapture';
import { cleanupOcr } from './OcrProcessor';
import { MedicareErrorBoundary } from './MedicareErrorBoundary';
import {
  FormContainer,
  InputRow,
  SmallInput,
  InputGroup,
  Label,
  ErrorText,
  HelpText,
  Button
} from './MedicareForm.styles';

const CONFIDENCE_THRESHOLD = 70;

export const MedicareForm: React.FC<MedicareFormProps> = ({
  formData,
  onInputChange,
  error,
  isTransitioning
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [lastOcrResult, setLastOcrResult] = useState<OcrResult | null>(null);

  // Cleanup OCR worker on unmount
  useEffect(() => {
    return () => {
      cleanupOcr().catch(console.error);
    };
  }, []);

  const validateMedicareNumber = (value: string): MedicareValidation => {
    if (!value) {
      return { isValid: false, error: 'Medicare number is required' };
    }
    if (!/^\d{10}$/.test(value)) {
      return { isValid: false, error: 'Medicare number must be 10 digits' };
    }
    return { isValid: true };
  };

  const validateIRN = (value: string): MedicareValidation => {
    if (!value) {
      return { isValid: false, error: 'IRN is required' };
    }
    if (!/^[1-9]$/.test(value)) {
      return { isValid: false, error: 'IRN must be a single digit between 1-9' };
    }
    return { isValid: true };
  };

  const validateExpiry = (value: string): MedicareValidation => {
    if (!value) {
      return { isValid: false, error: 'Expiry date is required' };
    }

    const [month, year] = value.split('/');
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);

    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return { isValid: false, error: 'Expiry date must be in MM/YY format' };
    }

    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: 'Invalid month' };
    }

    if (expiryDate < currentDate) {
      return { isValid: false, error: 'Medicare card has expired' };
    }

    return { isValid: true };
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    onInputChange('medicareExpiry', value);
  };

  const handleCapture = (imageData: string) => {
    onInputChange('medicareCardImage', imageData);
  };

  const handleOcrComplete = (result: OcrResult) => {
    setLastOcrResult(result);

    // Auto-populate fields if confidence is high enough
    if (result.confidence >= CONFIDENCE_THRESHOLD) {
      if (result.medicareNumber) {
        onInputChange('medicareNumber', result.medicareNumber);
      }
      if (result.medicareIRN) {
        onInputChange('medicareIRN', result.medicareIRN);
      }
      if (result.medicareExpiry) {
        onInputChange('medicareExpiry', result.medicareExpiry);
      }
    }

    setShowCamera(false);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    // Clean up OCR worker when camera is closed
    cleanupOcr().catch(console.error);
  };

  return (
    <FormContainer>
      <MedicareErrorBoundary onReset={() => setShowCamera(false)}>
        <Button
          variant="primary"
          onClick={() => setShowCamera(true)}
          style={{ marginBottom: '1rem' }}
        >
          Scan Medicare Card
        </Button>

        {lastOcrResult && lastOcrResult.confidence < CONFIDENCE_THRESHOLD && (
          <div style={{ marginBottom: '1rem' }}>
            <HelpText style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '0.75rem', borderRadius: '0.375rem' }}>
              Some details couldn't be read clearly. Please verify and correct the information below.
            </HelpText>
          </div>
        )}

        <MedicareInput
          label="Medicare Number"
          value={formData.medicareNumber}
          onChange={(value) => onInputChange('medicareNumber', value)}
          error={validateMedicareNumber(formData.medicareNumber).error}
          isTransitioning={isTransitioning}
          placeholder="XXXX XXXXX X"
          helpText="Enter your Medicare card number"
        />

        <InputRow>
          <InputGroup>
            <Label>
              IRN<span style={{ color: '#dc3545' }}> *</span>
            </Label>
            <SmallInput
              type="text"
              value={formData.medicareIRN}
              onChange={(e) => onInputChange('medicareIRN', e.target.value.replace(/\D/g, ''))}
              maxLength={1}
              placeholder="X"
              hasError={!!validateIRN(formData.medicareIRN).error}
              disabled={isTransitioning}
              aria-label="IRN (Individual Reference Number)"
              aria-required={true}
            />
            {validateIRN(formData.medicareIRN).error && (
              <ErrorText role="alert">
                {validateIRN(formData.medicareIRN).error}
              </ErrorText>
            )}
            <HelpText>Individual Reference Number (IRN)</HelpText>
          </InputGroup>

          <InputGroup>
            <Label>
              Expiry Date<span style={{ color: '#dc3545' }}> *</span>
            </Label>
            <SmallInput
              type="text"
              value={formData.medicareExpiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength={5}
              hasError={!!validateExpiry(formData.medicareExpiry).error}
              disabled={isTransitioning}
              aria-label="Expiry Date"
              aria-required={true}
            />
            {validateExpiry(formData.medicareExpiry).error && (
              <ErrorText role="alert">
                {validateExpiry(formData.medicareExpiry).error}
              </ErrorText>
            )}
            <HelpText>Card expiry date</HelpText>
          </InputGroup>
        </InputRow>

        {error && (
          <ErrorText role="alert" style={{ marginTop: '1rem' }}>
            {error}
          </ErrorText>
        )}

        <MedicareCapture
          isOpen={showCamera}
          onClose={handleCloseCamera}
          onCapture={handleCapture}
        />
      </MedicareErrorBoundary>
    </FormContainer>
  );
}; 