import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../../Layout/PageLayout';
import { Header } from '../../shared/Header';
import { EmergencyBanner } from '../../shared/EmergencyBanner';
import { registrationSteps } from '../steps';
import type { RegistrationData } from '../types';
import { loadGPData, getGPById } from '../../../utils/gpDataLoader';
import { AccountCreationModal } from '../components/AccountCreationModal';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { ReviewSection } from './ReviewSection';
import {
  Container,
  Content,
  ProgressSection,
  ReviewCard,
  InfoBox,
  InfoContent,
  InfoTitle,
  InfoText,
  SubmitButtonContainer,
  SubmitButton,
  MainContent
} from './styles';

export const ConfirmationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [gpDetails, setGpDetails] = useState<any>(null);
  const [isLoadingGP, setIsLoadingGP] = useState(true);
  const [sectionsReviewed, setSectionsReviewed] = useState<Set<string>>(new Set());
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const reviewContentRef = useRef<HTMLDivElement>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  const isEmergency = searchParams.get('type') === 'emergency';
  const { registrationData } = location.state as { registrationData: RegistrationData };

  useEffect(() => {
    const loadGPDetails = async () => {
      setIsLoadingGP(true);
      try {
        await loadGPData();
        
        if (registrationData.gpName) {
          if (registrationData.gpDetails) {
            try {
              const parsed = typeof registrationData.gpDetails === 'string'
                ? JSON.parse(registrationData.gpDetails)
                : registrationData.gpDetails;
              setGpDetails(parsed);
              return;
            } catch (e) {
              console.error('Error parsing stored GP details:', e);
            }
          }

          const lookedUpGP = getGPById(registrationData.gpName);
          if (lookedUpGP) {
            setGpDetails(lookedUpGP);
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

  useEffect(() => {
    const totalSections = Object.keys(registrationSteps.reduce((acc, step) => {
      if (!step.section) return acc;
      if (!acc[step.section]) acc[step.section] = true;
      return acc;
    }, {} as Record<string, boolean>)).length;

    setCanSubmit(sectionsReviewed.size === totalSections);
  }, [sectionsReviewed, registrationSteps]);

  const handleSubmit = () => {
    setShowAccountModal(true);
  };

  const handleCompleteRegistration = (createAccount: boolean, password: string) => {
    const submissionData = {
      ...registrationData,
      ...(createAccount && password ? {
        accountDetails: {
          email: registrationData.email,
          password
        }
      } : {})
    };
    
    navigate('/triage');
  };

  const shouldShowSection = (sectionName: string): boolean => {
    return sectionName === "Registration Type" || 
      !(registrationData.isThirdParty === 'For myself' && sectionName === "Registrant Details");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const currentStep = 3;
  const totalSteps = 4;

  return (
    <PageLayout>
      <Container>
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white' }}>
          <Header showLogo title="Virtual Emergency Department" />
          <ProgressSection>
            <Content>
              <ProgressIndicator
                currentSection="Review all answers"
                totalSections={totalSteps}
                currentSectionNumber={currentStep}
                questionsInSection={1}
                currentQuestionInSection={1}
                nextSection="Connect to Triage team"
                isLastQuestionInSection={true}
              />
            </Content>
          </ProgressSection>
        </div>

        <Content>
          <MainContent>
            <InfoBox>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <InfoContent>
                <InfoTitle>Review Your Information</InfoTitle>
                <InfoText>
                  Please check your details are correct before proceeding. You can make changes by clicking the edit button on each section.
                </InfoText>
              </InfoContent>
            </InfoBox>

            <ReviewCard>
              {Object.entries(registrationSteps.reduce((acc, step) => {
                if (!step.section) return acc;
                if (!acc[step.section]) acc[step.section] = true;
                return acc;
              }, {} as Record<string, boolean>))
              .filter(([sectionName]) => shouldShowSection(sectionName))
              .map(([sectionName]) => (
                <ReviewSection
                  key={sectionName}
                  sectionName={sectionName}
                  registrationData={registrationData}
                  gpInfo={{ details: gpDetails, isLoading: isLoadingGP }}
                />
              ))}
            </ReviewCard>
          </MainContent>

          {showAccountModal && (
            <AccountCreationModal
              onClose={() => setShowAccountModal(false)}
              onComplete={handleCompleteRegistration}
              registrationData={{
                email: registrationData.email,
                ...Object.fromEntries(
                  Object.entries(registrationData).filter(([key]) => key !== 'email')
                )
              } as any}
            />
          )}
        </Content>

        <SubmitButtonContainer>
          <SubmitButton 
            onClick={handleSubmit}
            isEnabled={true}
          >
            Complete Registration
          </SubmitButton>
        </SubmitButtonContainer>

        {isEmergency && <EmergencyBanner />}
      </Container>
    </PageLayout>
  );
}; 