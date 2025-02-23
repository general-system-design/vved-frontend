import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import type { RegistrationData } from '../types';

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
`;

interface SearchInputProps {
  $hasError?: boolean;
}

const SearchInput = styled.input<SearchInputProps>`
  width: 100%;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border: 1.5px solid ${({ $hasError }) => 
    $hasError ? theme.colors.emergency : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.small} 0 0;
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.background};
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.text.disabled};
  }
`;

const DetailsCard = styled.div`
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium};
  margin-top: ${theme.spacing.small};
  background-color: ${theme.colors.background};
`;

const DetailRow = styled.div`
  display: flex;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.small};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
  min-width: 80px;
`;

const DetailValue = styled.span`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.small};
`;

const ManualEntryButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.small};
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-top: ${theme.spacing.small};
  
  &:hover {
    color: ${theme.colors.primary};
    opacity: 0.8;
  }
`;

const ManualEntryForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.medium};
  padding: ${theme.spacing.medium};
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
`;

const ManualInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

interface SearchResult {
  label: string;
  value: string;
  details: any;
}

interface GPSearchProps {
  formData: RegistrationData;
  onInputChange: (field: keyof RegistrationData, value: string) => Promise<void>;
  error?: string;
  isTransitioning: boolean;
  step: {
    field: keyof RegistrationData;
    placeholder?: string;
    onSearch?: (query: string) => Promise<any[]>;
    formatSearchResult?: (result: any) => SearchResult;
  };
}

export const GPSearch: React.FC<GPSearchProps> = ({
  formData,
  onInputChange,
  error,
  isTransitioning,
  step
}) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchError, setSearchError] = useState<string>();
  const [selectedGP, setSelectedGP] = useState<SearchResult | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Initialize input value from formData if it exists
  useEffect(() => {
    if (formData[step.field]) {
      setInputValue(formData[step.field] as string);
    }
  }, [formData, step.field]);

  const handleSearch = async (query: string) => {
    setInputValue(query);
    setSearchError(undefined);
    setShowManualEntry(false);
    
    if (!query.trim() || !step.onSearch) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const results = await step.onSearch(query);
      console.log('Search results before formatting:', results);
      
      if (step.formatSearchResult && results.length > 0) {
        const formattedResults = results
          .map(result => {
            try {
              return step.formatSearchResult!(result);
            } catch (error) {
              console.error('Error formatting result:', error, result);
              return null;
            }
          })
          .filter((result): result is SearchResult => result !== null);
        
        console.log('Formatted results:', formattedResults);
        setSearchResults(formattedResults);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Failed to search GPs:', error);
      setSearchError('Failed to search medical clinics. Please try again.');
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = async (result: SearchResult) => {
    console.group('GP Selection');
    console.log('Selected GP:', result);
    
    if (!result.value) {
      console.error('No value provided for GP selection');
      console.groupEnd();
      return;
    }
    
    setInputValue(result.label);
    setSelectedGP(result);
    
    // Prepare address parts
    const addressParts = [
      result.details.Postal_Address,
      result.details.Postal_Suburb,
      result.details.Postal_State,
      result.details.Postal_Postcode
    ].filter(part => part?.trim());
    
    // Create a single update object with all GP data
    const gpData = {
      [step.field]: result.value, // gpName
      gpClinic: result.details.HealthOrg_Description || result.label,
      gpAddress: addressParts.join(', '),
      gpDetails: JSON.stringify(result.details)
    };
    
    console.log('Submitting GP data:', gpData);
    
    // Submit all GP data at once
    for (const [field, value] of Object.entries(gpData)) {
      await onInputChange(field as keyof RegistrationData, value);
    }
    
    console.log('GP data submitted');
    console.groupEnd();
    
    setShowSuggestions(false);
    setShowManualEntry(false);
  };

  const handleManualEntry = async () => {
    setShowManualEntry(true);
    setShowSuggestions(false);
    setSelectedGP(null);
    setInputValue('');
    await onInputChange(step.field, '');
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const clinicName = formData.get('clinicName') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    
    const manualGP = {
      label: `${clinicName} - ${address}`,
      value: 'MANUAL_ENTRY',
      details: {
        HealthOrg_Description: clinicName,
        Postal_Address: address,
        Phone: phone,
        HEORG_REFNO: 'MANUAL_ENTRY'
      }
    };
    
    console.log('Manual GP entry:', manualGP);
    await handleSelect(manualGP);
  };

  return (
    <SearchContainer>
      {!showManualEntry && (
        <>
          <SearchInput
            type="text"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={step.placeholder}
            $hasError={!!error}
            disabled={isTransitioning}
          />
          {showSuggestions && searchResults.length > 0 && (
            <SuggestionsList>
              {searchResults.map((result, index) => (
                <SuggestionItem
                  key={index}
                  onClick={() => handleSelect(result)}
                >
                  {result.label}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </>
      )}

      {selectedGP && !showManualEntry && (
        <DetailsCard>
          <DetailRow>
            <DetailLabel>Name:</DetailLabel>
            <DetailValue>{selectedGP.details.HealthOrg_Description}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Address:</DetailLabel>
            <DetailValue>{selectedGP.details.Postal_Address}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Phone:</DetailLabel>
            <DetailValue>{selectedGP.details.Phone || selectedGP.details.Work_Phone}</DetailValue>
          </DetailRow>
        </DetailsCard>
      )}

      {showManualEntry ? (
        <ManualEntryForm as="form" onSubmit={handleManualSubmit}>
          <ManualInput
            name="clinicName"
            placeholder="Clinic Name"
            required
          />
          <ManualInput
            name="address"
            placeholder="Clinic Address"
            required
          />
          <ManualInput
            name="phone"
            placeholder="Clinic Phone"
            type="tel"
            required
          />
          <button type="submit">Save Clinic Details</button>
          <ManualEntryButton type="button" onClick={() => setShowManualEntry(false)}>
            Cancel
          </ManualEntryButton>
        </ManualEntryForm>
      ) : (
        <ManualEntryButton type="button" onClick={handleManualEntry}>
          Can't find your medical clinic? Enter details manually
        </ManualEntryButton>
      )}

      {searchError && <div style={{ color: theme.colors.emergency, marginTop: theme.spacing.small }}>{searchError}</div>}
    </SearchContainer>
  );
}; 