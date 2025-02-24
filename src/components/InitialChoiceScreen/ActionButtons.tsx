import { ButtonContainer, Button } from './styles';

interface ActionButtonsProps {
  onEmergency: () => void;
  onPreRegister: () => void;
}

export const ActionButtons = ({ onEmergency, onPreRegister }: ActionButtonsProps) => {
  return (
    <ButtonContainer>
      <Button 
        variant="emergency" 
        onClick={onEmergency}
        aria-label="Start virtual emergency assessment"
      >
        Start Virtual Emergency Consult
      </Button>
      
      <Button 
        variant="regular" 
        onClick={onPreRegister}
        aria-label="Pre-register for future visits"
      >
        Pre-register for Future Visits
      </Button>
    </ButtonContainer>
  );
}; 