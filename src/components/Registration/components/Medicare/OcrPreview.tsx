import React, { useState, useEffect } from 'react';
import { OcrResult } from '../../types/medicare';
import { MedicareInput } from './MedicareInput';
import {
  InputGroup,
  Label,
  SmallInput,
  ErrorText,
  HelpText,
  Button
} from './MedicareForm.styles';
import {
  PreviewContainer,
  ConfidenceIndicator,
  ProcessingStatus
} from './MedicareCapture.styles';

interface OcrPreviewProps {
  ocrResult: OcrResult;
  onConfirm: (correctedResult: OcrResult) => void;
  onRetry: () => void;
  onCancel: () => void;
}

export const OcrPreview: React.FC<OcrPreviewProps> = ({
  ocrResult,
  onConfirm,
  onRetry,
  onCancel
}) => {
  const [correctedResult, setCorrectedResult] = useState<OcrResult>(ocrResult);
  const [hasEdits, setHasEdits] = useState(false);

  useEffect(() => {
    setCorrectedResult(ocrResult);
    setHasEdits(false);
  }, [ocrResult]);

  const handleInputChange = (field: keyof Omit<OcrResult, 'confidence' | 'rawText'>, value: string) => {
    setCorrectedResult(prev => ({
      ...prev,
      [field]: value
    }));
    setHasEdits(true);
  };


  const validateMedicareNumber = (value?: string) => {
    if (!value) return 'Medicare number is required';
    if (!/^\d{10}$/.test(value)) return 'Medicare number must be 10 digits';
    return undefined;
  };

  const validateIRN = (value?: string) => {
    if (!value) return 'IRN is required';
    if (!/^[1-9]$/.test(value)) return 'IRN must be a single digit between 1-9';
    return undefined;
  };

  const validateExpiry = (value?: string) => {
    if (!value) return 'Expiry date is required';
    if (!/^\d{2}\/\d{2}$/.test(value)) return 'Expiry date must be in MM/YY format';
    
    const [month, year] = value.split('/');
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) return 'Invalid month';
    
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
    if (expiryDate < currentDate) return 'Medicare card has expired';
    
    return undefined;
  };

  const isValid = () => {
    return !validateMedicareNumber(correctedResult.medicareNumber) &&
           !validateIRN(correctedResult.medicareIRN) &&
           !validateExpiry(correctedResult.medicareExpiry);
  };

  return (
    <PreviewContainer>
      <ProcessingStatus>
        OCR Confidence: {ocrResult.confidence.toFixed(1)}%
        <ConfidenceIndicator value={ocrResult.confidence} />
      </ProcessingStatus>

      <div style={{ marginTop: '1rem' }}>
        <MedicareInput
          label="Medicare Number"
          value={correctedResult.medicareNumber || ''}
          onChange={(value: string) => handleInputChange('medicareNumber', value)}
          error={validateMedicareNumber(correctedResult.medicareNumber)}
          placeholder="XXXX XXXXX X"
          helpText={hasEdits ? 'Manually corrected' : 'Extracted from image'}
        />

        <InputGroup>
          <Label>IRN</Label>
          <SmallInput
            type="text"
            value={correctedResult.medicareIRN || ''}
            onChange={(e) => handleInputChange('medicareIRN', e.target.value.replace(/\D/g, ''))}
            maxLength={1}
            placeholder="X"
            hasError={!!validateIRN(correctedResult.medicareIRN)}
          />
          {validateIRN(correctedResult.medicareIRN) && (
            <ErrorText>{validateIRN(correctedResult.medicareIRN)}</ErrorText>
          )}
          <HelpText>{hasEdits ? 'Manually corrected' : 'Extracted from image'}</HelpText>
        </InputGroup>

        <InputGroup>
          <Label>Expiry Date</Label>
          <SmallInput
            type="text"
            value={correctedResult.medicareExpiry || ''}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length >= 2) {
                value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
              }
              handleInputChange('medicareExpiry', value);
            }}
            placeholder="MM/YY"
            maxLength={5}
            hasError={!!validateExpiry(correctedResult.medicareExpiry)}
          />
          {validateExpiry(correctedResult.medicareExpiry) && (
            <ErrorText>{validateExpiry(correctedResult.medicareExpiry)}</ErrorText>
          )}
          <HelpText>{hasEdits ? 'Manually corrected' : 'Extracted from image'}</HelpText>
        </InputGroup>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '1.5rem',
        justifyContent: 'space-between' 
      }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onRetry}>Retake Photo</Button>
        <Button
          onClick={() => onConfirm(correctedResult)}
          disabled={!isValid()}
          type="button"
        >
          {hasEdits ? 'Confirm Changes' : 'Confirm Details'}
        </Button>
      </div>
    </PreviewContainer>
  );
}; 