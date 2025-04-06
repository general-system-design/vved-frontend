import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../../../Layout/PageLayout';
import { EmergencyBanner } from '../../../shared/EmergencyBanner';
import { Header } from '../../../shared/Header';
import { AccountCreationModal } from '../../components/AccountCreationModal';
import { EmergencyWorkflow } from '../../components/Emergency/EmergencyWorkflow';
import { PreRegisterWorkflow } from '../../components/PreRegister/PreRegisterWorkflow';
import { Container, ContentWrapper } from './styles';

export const RegistrationChoiceScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmergency = searchParams.get('type') === 'emergency';
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  const handleExistingUser = () => {
    navigate(`/auth?type=${searchParams.get('type')}`);
  };
  
  const handleNewUser = () => {
    if (isEmergency) {
      navigate(`/register?type=${searchParams.get('type')}&isNew=true`);
    } else {
      setShowAccountModal(true);
    }
  };

  const handleAccountCreation = (createAccount: boolean, password: string) => {
    setShowAccountModal(false);
    navigate(`/register?type=${searchParams.get('type')}&isNew=true&hasAccount=true`);
  };

  const handleSwitchToEmergency = () => {
    navigate('/?type=emergency');
  };
  
  return (
    <PageLayout 
      progress={10}
      showBack
      onBack={() => navigate('/')}
    >
      <div>
        <Header showLogo title="Virtual Emergency Department" />

        <Container isEmergency={isEmergency}>
          <ContentWrapper>
            {isEmergency ? (
              <EmergencyWorkflow
                onExistingUser={handleExistingUser}
                onNewUser={handleNewUser}
              />
            ) : (
              <PreRegisterWorkflow
                onExistingUser={handleExistingUser}
                onNewUser={handleNewUser}
                onSwitchToEmergency={handleSwitchToEmergency}
              />
            )}
          </ContentWrapper>
        </Container>
        {isEmergency && <EmergencyBanner />}
      </div>

      {showAccountModal && (
        <AccountCreationModal
          onClose={() => setShowAccountModal(false)}
          onComplete={handleAccountCreation}
          registrationData={{}}
          context="pre-registration"
        />
      )}
    </PageLayout>
  );
}; 