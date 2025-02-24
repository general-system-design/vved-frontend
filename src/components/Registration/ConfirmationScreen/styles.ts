import styled, { keyframes } from 'styled-components';
import { theme } from '../../../styles/theme';

export const fadeIn = keyframes`
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

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
  position: relative;
`;

export const Content = styled.div<ContentProps>`
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

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
`;

export const ProgressSection = styled.div`
  margin: ${theme.spacing.medium} 0 ${theme.spacing.small};
`;

export const ReviewCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.large};
  border: 1px solid rgba(0, 102, 204, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.spacing.medium};
  overflow: hidden;
  transition: all 0.2s ease;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.text.disabled};
    border-radius: 4px;
  }
`;

export const ReviewSection = styled.div`
  padding: ${theme.spacing.large};
  
  &:first-child {
    border-top-left-radius: ${theme.borderRadius.medium};
    border-top-right-radius: ${theme.borderRadius.medium};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.medium};
  }
`;

export const SectionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.medium};
`;

export const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.primary};
  opacity: 0.9;
`;

export const SectionTitle = styled.h2`
  font-size: 13px;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin: 0;
`;

export const SectionContent = styled.div`
  color: ${theme.colors.text.primary};
  font-size: 15px;
  line-height: 1.6;
  margin-top: ${theme.spacing.small};
`;

export const NarrativeText = styled.div`
  margin-bottom: ${theme.spacing.small};
`;

export const DetailsList = styled.ul`
  margin: ${theme.spacing.small} 0 0;
  padding-left: ${theme.spacing.large};
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  
  li {
    margin-bottom: 4px;
  }
`;

export const InfoBox = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.primary}15;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.medium};
  margin-top: 0;
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.medium};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.primary};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoTitle = styled.div`
  color: ${theme.colors.text.primary};
  font-weight: 500;
  margin-bottom: ${theme.spacing.small};
  font-size: 15px;
`;

export const InfoText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  line-height: 1.5;
`;

interface SubmitButtonContainerProps {
  isEmergency: boolean;
}

export const SubmitButtonContainer = styled.div<SubmitButtonContainerProps>`
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

export const SubmitButton = styled.button<SubmitButtonProps>`
  width: 100%;
  height: 48px;
  padding: 0 ${theme.spacing.medium};
  background: ${props => props.isEnabled ? 
    `linear-gradient(to bottom, ${theme.colors.primary}, ${theme.colors.primary}ee)` : 
    theme.colors.surface};
  color: ${props => props.isEnabled ? 'white' : theme.colors.text.disabled};
  border: 1.5px solid ${props => props.isEnabled ? 'transparent' : theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  font-size: 15px;
  font-weight: 600;
  cursor: ${props => props.isEnabled ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};
  box-shadow: ${props => props.isEnabled ? '0 2px 8px rgba(0, 102, 204, 0.2)' : 'none'};

  &:hover {
    transform: ${props => props.isEnabled ? 'translateY(-1px)' : 'none'};
    background: ${props => props.isEnabled ? 
      `linear-gradient(to bottom, ${theme.colors.primary}ee, ${theme.colors.primary})` : 
      theme.colors.surface};
    box-shadow: ${props => props.isEnabled ? '0 4px 12px rgba(0, 102, 204, 0.3)' : 'none'};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.isEnabled ? '0 2px 4px rgba(0, 102, 204, 0.2)' : 'none'};
  }
`; 