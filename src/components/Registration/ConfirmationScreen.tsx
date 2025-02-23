import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { PageLayout } from '../Layout/PageLayout';
import { Header } from '../shared/Header';
import { EmergencyBanner } from '../shared/EmergencyBanner';
import { registrationSteps } from './steps';
import type { RegistrationData, GPDetails } from './types/index';
import { loadGPData, getGPById } from '../../utils/gpDataLoader';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface ContainerProps {
  isEmergency?: boolean;
}

interface ContentProps {
  isEmergency?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
  position: relative;
`;

const Content = styled.div<ContentProps>`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: ${theme.spacing.large};
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: ${props => props.isEmergency ? '80px' : '0'};

  @media (max-width: 800px) {
    padding: ${theme.spacing.medium};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.medium};
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background: ${theme.colors.surface};
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StepDot = styled.div<{ active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? theme.colors.primary : theme.colors.surface};
  border: 1px solid ${props => props.active ? theme.colors.primary : theme.colors.secondary};
  opacity: ${props => props.active ? 1 : 0.4};
  margin: 0 ${theme.spacing.small};
  transition: all 0.2s ease;
`;

const StepLine = styled.div<{ active?: boolean }>`
  width: 24px;
  height: 1px;
  background: ${props => props.active ? theme.colors.primary : theme.colors.secondary};
  opacity: ${props => props.active ? 0.5 : 0.2};
`;

const StepLabel = styled.div<{ active?: boolean }>`
  font-size: 11px;
  color: ${props => props.active ? theme.colors.text.primary : theme.colors.text.secondary};
  position: absolute;
  top: 24px;
  white-space: nowrap;
  font-weight: ${props => props.active ? 500 : 400};
  letter-spacing: 0.3px;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h2};
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.medium} 0 ${theme.spacing.small};
  text-align: center;
  line-height: 1.2;
`;

const GuidanceText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.body};
  line-height: 1.6;
  margin: 0 auto ${theme.spacing.medium};
  text-align: center;
  max-width: 600px;
`;

const CriticalInfoBanner = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.medium};
  border: 1px solid rgba(0, 102, 204, 0.1);

  @media (max-width: 800px) {
    padding: ${theme.spacing.medium};
  }
`;

const CriticalInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${theme.spacing.medium};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: ${theme.typography.fontSize.h3};
  color: ${theme.colors.text.primary};
  font-weight: 600;
  line-height: 1.3;
`;

const SectionContainer = styled.div`
  padding: ${theme.spacing.medium} 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.small};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 ${theme.spacing.small};
  font-weight: 500;
`;

const EditButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.small};
  cursor: pointer;
  padding: ${theme.spacing.small};
  border-radius: ${theme.borderRadius.small};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 102, 204, 0.05);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.medium};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Label = styled.span`
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const Value = styled.span<{ isEmpty?: boolean; isHighlighted?: boolean }>`
  font-size: ${props => props.isHighlighted ? theme.typography.fontSize.h3 : theme.typography.fontSize.body};
  color: ${props => props.isEmpty ? theme.colors.text.disabled : theme.colors.text.primary};
  font-weight: ${props => props.isHighlighted ? 600 : 500};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EditButtonMobile = styled(EditButton)`
  color: ${theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border: 1px solid rgba(0, 102, 204, 0.15);
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 102, 204, 0.05);
    border-color: rgba(0, 102, 204, 0.3);
  }
`;

interface SubmitButtonContainerProps {
  isEmergency: boolean;
}

const SubmitButtonContainer = styled.div<SubmitButtonContainerProps>`
  position: sticky;
  bottom: ${props => props.isEmergency ? '80px' : '0'};
  background: linear-gradient(to top, white 85%, rgba(255, 255, 255, 0.9));
  padding: ${theme.spacing.medium};
  margin: 0 -${theme.spacing.large};
  
  @media (max-width: 800px) {
    margin: 0 -${theme.spacing.medium};
    padding: ${theme.spacing.medium};
  }
`;

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isEnabled: boolean;
}

const SubmitButton = styled.button<SubmitButtonProps>`
  width: 100%;
  padding: ${theme.spacing.medium};
  background: ${props => props.isEnabled ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.body};
  font-weight: 600;
  cursor: ${props => props.isEnabled ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.isEnabled ? 1 : 0.7};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};

  &:hover {
    transform: ${props => props.isEnabled ? 'translateY(-1px)' : 'none'};
    box-shadow: ${props => props.isEnabled ? '0 4px 12px rgba(0, 102, 204, 0.2)' : 'none'};
  }
`;

const CheckIcon = styled.span<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? theme.colors.success : theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.small};
  transition: all 0.2s ease;
  
  &::after {
    content: '✓';
    color: ${theme.colors.success};
    font-size: 11px;
    opacity: ${props => props.checked ? 1 : 0};
  }
`;

type IconComponent = () => React.ReactElement;

const SectionIcons: Record<string, IconComponent> = {
  'Registration Type': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  'Medicare Information': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  'Personal Information': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  'Medical Need': () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  ContactDetails: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  AddressInformation: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  EmergencyContact: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  GPInformation: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <path d="M3 9l2.69-5.39A2 2 0 0 1 7.54 2h8.92a2 2 0 0 1 1.85 1.61L21 9" />
      <line x1="12" y1="6" x2="12" y2="6.01" />
    </svg>
  ),
  HealthcareContext: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  )
} as const;

type SectionName = keyof typeof SectionIcons;

const getIconComponent = (sectionName: string): IconComponent => {
  return SectionIcons[sectionName] || SectionIcons['Personal Information'];
};

const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.text.secondary};
`;

const SectionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.medium};
`;

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    isThirdParty: 'Registering',
    title: 'Title',
    firstName: 'First Name',
    lastName: 'Last Name',
    medicareNumber: 'Medicare',
    medicareExpiry: 'Expiry',
    medicareIRN: 'IRN',
    birthDay: 'DOB',
    phone: 'Phone',
    email: 'Email',
    mainConcern: 'Main Concern',
    streetAddress: 'Address',
    suburb: 'Suburb',
    state: 'State',
    postcode: 'Postcode',
    nokName: 'Emergency Contact',
    nokRelationship: 'Relationship',
    nokContact: 'Contact Number',
    gpClinicName: 'GP Clinic',
    gpAddress: 'Clinic Address',
    preferredLanguage: 'Language',
    needsInterpreter: 'Needs Interpreter',
    indigenousStatus: 'Indigenous Status',
    religion: 'Religion'
  };
  return labels[field] || field;
};

const getSectionConfig = (sectionName: string): { fields: string[], layout: string[][] } => {
  const configs: Record<string, { fields: string[], layout: string[][] }> = {
    "Registration Type": {
      fields: ['isThirdParty'],
      layout: [['isThirdParty']]
    },
    "Personal Information": {
      fields: ['title', 'firstName', 'lastName', 'birthDay', 'birthMonth', 'birthYear'],
      layout: [
        ['firstName', 'lastName'],
        ['birthDay']
      ]
    },
    "Medicare Information": {
      fields: ['medicareNumber', 'medicareIRN', 'medicareExpiry'],
      layout: [['medicareNumber'], ['medicareIRN', 'medicareExpiry']]
    },
    "Contact Details": {
      fields: ['phone', 'email', 'preferredLanguage', 'needsInterpreter'],
      layout: [['phone', 'email'], ['preferredLanguage', 'needsInterpreter']]
    },
    "Medical Need": {
      fields: ['mainConcern', 'additionalDetails'],
      layout: [['mainConcern'], ['additionalDetails']]
    },
    "Address Information": {
      fields: ['streetAddress', 'suburb', 'state', 'postcode'],
      layout: [['streetAddress'], ['suburb', 'state'], ['postcode']]
    },
    "Emergency Contact": {
      fields: ['nokName', 'nokRelationship', 'nokContact'],
      layout: [['nokName'], ['nokRelationship', 'nokContact']]
    },
    "GP Information": {
      fields: ['gpClinic', 'gpAddress'],
      layout: [['gpClinic'], ['gpAddress']]
    },
    "Healthcare Context": {
      fields: ['countryOfBirth', 'indigenousStatus', 'religion'],
      layout: [['countryOfBirth'], ['indigenousStatus'], ['religion']]
    }
  };
  return configs[sectionName] || { fields: [], layout: [] };
};

const formatValue = (
  field: string,
  value: any,
  data: RegistrationData,
  gpInfo: { details: GPDetails | null; isLoading: boolean }
): string => {
  console.group(`Formatting field: ${field}`);
  console.log('Input value:', value);
  console.log('GP Details:', gpInfo.details);

  // Special handling for GP details
  if (field === 'gpClinic' || field === 'gpAddress') {
    if (gpInfo.isLoading) {
      console.groupEnd();
      return 'Loading...';
    }

    if (gpInfo.details) {
      if (field === 'gpClinic') {
        const clinic = gpInfo.details.HealthOrg_Description;
        console.log('Using GP clinic from details:', clinic);
        console.groupEnd();
        return clinic || 'Not provided';
      }

      if (field === 'gpAddress') {
        const addressParts = [
          gpInfo.details.Postal_Address,
          gpInfo.details.Postal_Suburb,
          gpInfo.details.Postal_State,
          gpInfo.details.Postal_Postcode
        ].filter(Boolean);
        const formattedAddress = addressParts.join(', ');
        console.log('Formatted GP Address:', formattedAddress);
        console.groupEnd();
        return formattedAddress || 'Not provided';
      }
    }
  }

  if (!value && value !== 0) {
    console.log('Empty value detected');
    console.groupEnd();
    return 'Not provided';
  }

  // Special handling for medicare number
  if (field === 'medicareNumber' && value) {
    const formatted = `${value} (IRN: ${data.medicareIRN || 'Not provided'})`;
    console.log('Formatted Medicare:', formatted);
    console.groupEnd();
    return formatted;
  }

  // Special handling for birth date
  if (field === 'birthDay' && data.birthDay && data.birthMonth && data.birthYear) {
    const formatted = `${data.birthDay}/${data.birthMonth}/${data.birthYear}`;
    console.log('Formatted Birth Date:', formatted);
    console.groupEnd();
    return formatted;
  }

  // Special handling for emergency contact
  if (field === 'nokRelationship' && !value && data.nokName) {
    console.log('Emergency contact name present but no relationship');
    console.groupEnd();
    return 'Emergency Contact';
  }

  if (field === 'nokContact' && !value && data.nokName) {
    console.log('Emergency contact name present but no contact number');
    console.groupEnd();
    return 'Contact number not provided';
  }

  console.log('Formatted value:', value.toString());
  console.groupEnd();
  return value.toString();
};

const ReviewCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid rgba(0, 102, 204, 0.1);
  margin-bottom: ${theme.spacing.medium};
`;

const ReviewSection = styled.div`
  padding: ${theme.spacing.medium};
  
  &:first-child {
    border-top-left-radius: ${theme.borderRadius.medium};
    border-top-right-radius: ${theme.borderRadius.medium};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
`;

export const ConfirmationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [gpDetails, setGpDetails] = useState<GPDetails | null>(null);
  const [isLoadingGP, setIsLoadingGP] = useState(true);
  const [sectionsReviewed, setSectionsReviewed] = useState<Set<string>>(new Set());
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const reviewContentRef = useRef<HTMLDivElement>(null);
  
  const isEmergency = searchParams.get('type') === 'emergency';
  console.log('Emergency status:', { isEmergency, searchParams: Object.fromEntries(searchParams.entries()) });
  
  const { registrationData } = location.state as { registrationData: RegistrationData };

  // Load GP data and lookup GP details when component mounts
  useEffect(() => {
    const loadGPDetails = async () => {
      setIsLoadingGP(true);
      try {
        await loadGPData();
        
        if (registrationData.gpName) {
          // First try to parse stored gpDetails
          if (registrationData.gpDetails) {
            try {
              const parsed = typeof registrationData.gpDetails === 'string'
                ? JSON.parse(registrationData.gpDetails) as GPDetails
                : registrationData.gpDetails;
              setGpDetails(parsed);
              console.log('Using stored GP details:', parsed);
              return;
            } catch (e) {
              console.error('Error parsing stored GP details:', e);
            }
          }

          // If no stored details or parsing failed, look up by ID
          const lookedUpGP = getGPById(registrationData.gpName);
          if (lookedUpGP) {
            setGpDetails(lookedUpGP);
            console.log('Using looked up GP details:', lookedUpGP);
          } else {
            console.warn('GP not found with ID:', registrationData.gpName);
          }
        }
      } catch (error) {
        console.error('Error loading GP data:', error);
      } finally {
        setIsLoadingGP(false);
      }
    };

    loadGPDetails();
  }, [registrationData.gpName, registrationData.gpDetails]);

  // Add comprehensive logging of registration data
  useEffect(() => {
    console.group('ConfirmationScreen - Registration Data Analysis');
    
    // Log full data
    console.log('Raw registration data:', registrationData);
    
    // Check GP Information
    console.group('GP Information Check');
    console.log('GP Name/ID:', registrationData.gpName);
    if (registrationData.gpName) {
      const gpDetails = getGPById(registrationData.gpName);
      console.log('Looked up GP Details:', gpDetails);
    }
    console.log('GP Clinic:', registrationData.gpClinic);
    console.log('GP Address:', registrationData.gpAddress);
    console.log('GP Details Object:', registrationData.gpDetails);
    console.groupEnd();

    // Check Emergency Contact
    console.group('Emergency Contact Check');
    console.log('Contact Name:', registrationData.nokName);
    console.log('Relationship:', registrationData.nokRelationship);
    console.log('Contact Number:', registrationData.nokContact);
    console.groupEnd();

    // Check Medical Information
    console.group('Medical Information Check');
    console.log('Main Concern:', registrationData.mainConcern);
    console.log('Additional Details:', registrationData.additionalDetails);
    console.groupEnd();

    // Check Healthcare Context
    console.group('Healthcare Context Check');
    console.log('Religion:', registrationData.religion);
    console.log('Indigenous Status:', registrationData.indigenousStatus);
    console.log('Needs Interpreter:', registrationData.needsInterpreter);
    console.log('Preferred Language:', registrationData.preferredLanguage);
    console.groupEnd();

    // Check for empty required fields
    const requiredFields = {
      gpInformation: ['gpName', 'gpClinic', 'gpAddress'],
      emergencyContact: ['nokName', 'nokRelationship', 'nokContact'],
      healthcare: ['religion', 'indigenousStatus'],
      medical: ['mainConcern']
    };

    console.group('Missing Required Fields Analysis');
    Object.entries(requiredFields).forEach(([section, fields]) => {
      const missingFields = fields.filter(field => !registrationData[field]);
      if (missingFields.length > 0) {
        console.warn(`${section} - Missing Fields:`, missingFields);
      }
    });
    console.groupEnd();

    console.groupEnd();
  }, [registrationData]);

  useEffect(() => {
    // Enable submit when all sections have been reviewed
    const totalSections = Object.keys(registrationSteps.reduce((acc, step) => {
      if (!step.section) return acc;
      if (!acc[step.section]) acc[step.section] = true;
      return acc;
    }, {} as Record<string, boolean>)).length;

    setCanSubmit(sectionsReviewed.size === totalSections);
  }, [sectionsReviewed, registrationSteps]);

  const handleEdit = (sectionName: string) => {
    setSectionsReviewed(prev => {
      const updated = new Set(prev);
      updated.add(sectionName);
      return updated;
    });
    console.log('Edit section:', sectionName);
  };

  const handleSubmit = () => {
    console.log('Submitting registration with data:', registrationData);
    navigate('/triage');
  };

  // Filter out sections based on registration type
  const shouldShowSection = (sectionName: string): boolean => {
    const shouldShow = sectionName === "Registration Type" || 
      !(registrationData.isThirdParty === 'For myself' && sectionName === "Registrant Details");
    
    console.log(`Section visibility check: ${sectionName}`, { 
      shouldShow, 
      isThirdParty: registrationData.isThirdParty 
    });
    
    return shouldShow;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100; // 100px threshold
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <>
      <PageLayout>
        <Container>
          <Header showLogo title="Virtual Emergency Department" />
          
          <Content isEmergency={true}>
            <ProgressSection>
              <StepIndicator>
                <StepItem>
                  <StepDot active />
                  <StepLabel active>Details</StepLabel>
                </StepItem>
                <StepLine active />
                <StepItem>
                  <StepDot active />
                  <StepLabel active>Medical</StepLabel>
                </StepItem>
                <StepLine active />
                <StepItem>
                  <StepDot active />
                  <StepLabel active>Review</StepLabel>
                </StepItem>
                <StepLine />
                <StepItem>
                  <StepDot />
                  <StepLabel>Triage</StepLabel>
                </StepItem>
              </StepIndicator>
            </ProgressSection>

            <Title>Review Your Emergency Registration</Title>
            
            <GuidanceText>
              Please review your details before connecting to our triage team.
            </GuidanceText>

            <ReviewCard>
              <div ref={reviewContentRef} onScroll={handleScroll} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {Object.entries(registrationSteps.reduce((acc, step) => {
                  if (!step.section) return acc;
                  if (!acc[step.section]) acc[step.section] = true;
                  return acc;
                }, {} as Record<string, boolean>))
                .filter(([sectionName]) => shouldShowSection(sectionName))
                .map(([sectionName]) => {
                  const config = getSectionConfig(sectionName);
                  const IconComponent = getIconComponent(sectionName);
                  
                  return (
                    <ReviewSection key={sectionName}>
                      <SectionHeaderContent>
                        <SectionIcon>
                          <IconComponent />
                        </SectionIcon>
                        <SectionTitle>{sectionName}</SectionTitle>
                      </SectionHeaderContent>
                      <SummaryGrid>
                        {config.layout.map((row, rowIndex) => {
                          const visibleFields = row.filter(field => {
                            if (['birthDay', 'birthMonth', 'birthYear'].includes(field)) {
                              return field === 'birthDay';
                            }
                            return true;
                          });

                          return visibleFields.map(field => {
                            if (['birthDay', 'birthMonth', 'birthYear'].includes(field)) {
                              if (field !== 'birthDay') return null;
                              return (
                                <SummaryItem key="dob">
                                  <Label>Date of Birth</Label>
                                  <Value isEmpty={!registrationData.birthDay}>
                                    {formatValue('birthDay', registrationData.birthDay, registrationData, { details: gpDetails, isLoading: isLoadingGP })}
                                  </Value>
                                </SummaryItem>
                              );
                            }
                            
                            return (
                              <SummaryItem key={field}>
                                <Label>{getFieldLabel(field)}</Label>
                                <Value isEmpty={
                                  field === 'gpClinic' || field === 'gpAddress'
                                    ? isLoadingGP || (!gpDetails && !registrationData[field])
                                    : !registrationData[field]
                                }
                                isHighlighted={field === 'mainConcern'}>
                                  {formatValue(field, registrationData[field], registrationData, { details: gpDetails, isLoading: isLoadingGP })}
                                </Value>
                              </SummaryItem>
                            );
                          });
                        })}
                      </SummaryGrid>
                    </ReviewSection>
                  );
                })}
              </div>
            </ReviewCard>

            <SubmitButtonContainer isEmergency={true}>
              <SubmitButton 
                onClick={handleSubmit} 
                isEnabled={hasScrolledToBottom}
                disabled={!hasScrolledToBottom}
              >
                {hasScrolledToBottom ? 'Connect to Triage Team' : 'Please Review Details'}
              </SubmitButton>
            </SubmitButtonContainer>
          </Content>
        </Container>
      </PageLayout>
      <EmergencyBanner />
    </>
  );
}; 