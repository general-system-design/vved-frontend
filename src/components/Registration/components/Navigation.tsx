import React from 'react';
import {
  NavigationContainer,
  ButtonContainer,
  Button
} from '../ConversationalRegistration.styles';

interface NavigationProps {
  isEmergency: boolean;
  showBack: boolean;
  onBack: () => void;
  onContinue?: () => void;
  showContinue?: boolean;
  disableContinue?: boolean;
  isTransitioning?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  isEmergency,
  showBack,
  onBack,
  onContinue,
  showContinue = true,
  disableContinue = false,
  isTransitioning = false
}) => {
  return (
    <NavigationContainer isEmergency={isEmergency}>
      <ButtonContainer isEmergency={isEmergency}>
        <Button 
          variant="secondary" 
          onClick={onBack}
          disabled={!showBack}
        >
          ← Back
        </Button>
        {showContinue && (
          <Button 
            onClick={onContinue}
            disabled={disableContinue || isTransitioning}
          >
            Continue →
          </Button>
        )}
      </ButtonContainer>
    </NavigationContainer>
  );
}; 