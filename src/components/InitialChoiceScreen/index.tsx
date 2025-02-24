import { WaitTimeDisplay } from '../WaitTimeDisplay/WaitTimeDisplay';
import { EmergencyBanner } from '../shared/EmergencyBanner';
import { Header } from '../shared/Header';
import { ScreenContainer, MainContent } from './styles';
import { Logo } from './Logo';
import { ActionButtons } from './ActionButtons';

interface InitialChoiceScreenProps {
  onEmergency: () => void;
  onPreRegister: () => void;
}

export const InitialChoiceScreen = ({ 
  onEmergency, 
  onPreRegister 
}: InitialChoiceScreenProps) => {
  return (
    <ScreenContainer>
      <Header showLogo title="Virtual Emergency Department" />
      
      <MainContent>
        <Logo />
        <ActionButtons 
          onEmergency={onEmergency}
          onPreRegister={onPreRegister}
        />
        <WaitTimeDisplay currentWaitTime={35} />
      </MainContent>

      <EmergencyBanner />
    </ScreenContainer>
  );
}; 