import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../../styles/theme';
import { useNavigate } from 'react-router-dom';
import {
  MedicareText,
  MedicareActions,
  MedicareButton
} from '../../ConversationalRegistration.styles';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: ${theme.spacing.medium};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xlarge} ${theme.spacing.large} ${theme.spacing.large};
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
  margin: auto;

  @media (max-width: 480px) {
    padding: ${theme.spacing.xlarge} ${theme.spacing.medium} ${theme.spacing.medium};
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  padding: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.primary};
  transition: all 0.2s ease;
  z-index: 1;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.large};
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: grid;
  gap: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.large};

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const OptionCard = styled.button<{ isPreferred?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius.medium};
  border: 1.5px solid ${props => props.isPreferred ? theme.colors.primary : theme.colors.text.disabled};
  background: ${props => props.isPreferred ? `linear-gradient(135deg, ${theme.colors.primary} 0%, #0052a3 100%)` : 'white'};
  color: ${props => props.isPreferred ? 'white' : theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.isPreferred ? 'rgba(0, 102, 204, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }
`;

const OptionTitle = styled.span`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: ${theme.spacing.small};
`;

const OptionDescription = styled.div`
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BenefitText = styled.span`
  display: block;
`;

const FreeServiceText = styled.p`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  margin: 0;
`;

interface MedicareOptionsModalProps {
  onClose: () => void;
  onSelect: (medicareOption: 'with-medicare' | 'without-medicare' | 'not-eligible') => void;
}

export const MedicareOptionsModal: React.FC<MedicareOptionsModalProps> = ({ onClose, onSelect }) => {
  const navigate = useNavigate();
  
  const handleWithMedicare = () => {
    onClose();
    navigate(`/register?type=emergency&medicareChoice=with-medicare`);
  };
  
  const handleWithoutMedicare = () => {
    onClose();
    navigate(`/register?type=emergency&medicareChoice=without-medicare`);
  };
  
  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={onClose} aria-label="Close modal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>

        <Title>Do you have your Medicare card with you?</Title>
        
        <OptionsContainer>
          <OptionCard 
            isPreferred
            onClick={handleWithMedicare}
            aria-label="Yes, I have my Medicare card"
          >
            <OptionTitle>Yes, I have my Medicare card</OptionTitle>
            <OptionDescription>
              <BenefitText>Faster registration (save up to 20 minutes)</BenefitText>
              <BenefitText>E-scripts direct to your pharmacy</BenefitText>
            </OptionDescription>
          </OptionCard>
          
          <OptionCard
            onClick={handleWithoutMedicare}
            aria-label="No, continue without Medicare"
          >
            <OptionTitle>No, continue without Medicare</OptionTitle>
            <OptionDescription>
              <BenefitText>Same medical care and service</BenefitText>
            </OptionDescription>
          </OptionCard>
        </OptionsContainer>

        <FreeServiceText>
          This service is free for all patients, with or without Medicare
        </FreeServiceText>
      </ModalContent>
    </Modal>
  );
}; 