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

export const ProgressSection = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.small} 0;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  min-height: 56px; /* Match the FormContainer height */
  display: flex;
  align-items: center;
  
  /* Add subtle shadow when scrolled */
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -8px;
    height: 8px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.04), transparent);
    pointer-events: none;
  }
`;

export const Content = styled.div<ContentProps>`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 ${theme.spacing.large};
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  flex: 1;

  &:not(:first-child) {
    padding-top: ${theme.spacing.medium};
    padding-bottom: calc(${theme.spacing.large} + 80px); /* Space for fixed button */
  }

  @media (max-width: 800px) {
    padding: 0 ${theme.spacing.medium};
    
    &:not(:first-child) {
      padding-top: ${theme.spacing.medium};
      padding-bottom: calc(${theme.spacing.medium} + 80px);
    }
  }
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
`;

export const ReviewCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.large};
  border: none;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 12px 24px rgba(0, 0, 0, 0.03);
  margin-bottom: ${theme.spacing.medium};
  overflow: hidden;
  transition: all 0.3s ease;
`;

export const ReviewSection = styled.div`
  padding: ${theme.spacing.large};
  position: relative;
  background: white;
  transition: all 0.2s ease;

  /* Key information sections get subtle emphasis */
  &[data-section="Medicare Information"] {
    background: linear-gradient(to bottom, ${theme.colors.background}, white);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.medium};
  }
`;

export const SectionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.medium};
  margin: -${theme.spacing.large};
  margin-bottom: 0;
  justify-content: space-between;
  position: relative;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background: ${theme.colors.background};
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  @media (max-width: 480px) {
    margin: -${theme.spacing.medium};
    margin-bottom: 0;
    padding: ${theme.spacing.medium};
  }
`;

export const SectionTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.medium};
`;

export const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.small};
  position: relative;
  background: white;
  box-shadow: 
    inset 0 0 0 1px rgba(0, 102, 204, 0.15),
    inset 0 1px 2px rgba(0, 102, 204, 0.1);
  
  svg {
    width: 18px;
    height: 18px;
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.header};
  font-size: 15px;
  color: ${theme.colors.text.primary};
  letter-spacing: -0.1px;
  font-weight: 600;
  margin: 0;
  position: relative;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const SectionContent = styled.div`
  color: ${theme.colors.text.primary};
  font-size: 15px;
  line-height: 1.6;
  margin-top: 0;
`;

export const NarrativeText = styled.p`
  color: ${theme.colors.text.primary};
  font-size: 15px;
  line-height: 1.6;
  margin-top: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.medium};
`;

export const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  margin: 0 -${theme.spacing.large};
  
  @media (max-width: 480px) {
    margin: 0 -${theme.spacing.medium};
  }
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  position: relative;
  min-height: 56px;
  transition: background 0.2s ease;
  background: white;

  &:hover {
    background: ${theme.colors.background};
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.medium};
    min-height: 52px;
  }
`;

export const DetailLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
  flex: 0 0 140px;
  padding-right: ${theme.spacing.medium};

  @media (max-width: 480px) {
    flex: 0 0 120px;
    font-size: 13px;
  }
`;

export const DetailValue = styled.div`
  color: ${theme.colors.text.primary};
  font-size: 15px;
  font-weight: 450;
  letter-spacing: -0.2px;
  line-height: 1.4;
  flex: 1;
  text-align: left;

  /* Special styling for important numbers */
  &[data-type="number"] {
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
  }

  /* Empty state styling */
  &:empty::before {
    content: 'Not provided';
    color: ${theme.colors.text.disabled};
    font-style: italic;
  }

  /* Highlight Medicare number */
  &[data-field="medicare-number"] {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: ${theme.colors.text.primary};
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const InfoBox = styled.div`
  background: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.medium} ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.medium};
  margin-top: ${theme.spacing.small};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.medium};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.primary};
    opacity: 0.9;
    flex-shrink: 0;
    margin-top: 2px;
  }

  @media (max-width: 480px) {
    margin: ${theme.spacing.medium};
    background: ${theme.colors.primary}04;
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


export const SubmitButtonContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  padding: ${theme.spacing.medium};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 100;
  
  @media (max-width: 800px) {
    padding: ${theme.spacing.small};
  }
`;

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isEnabled: boolean;
}

export const SubmitButton = styled.button<SubmitButtonProps>`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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

export const EditButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.small};
  margin: -${theme.spacing.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: all 0.2s ease;
  border-radius: ${theme.borderRadius.medium};

  &:hover {
    color: ${theme.colors.primary};
    background: ${theme.colors.primary}08;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.small};
    
    span {
      display: none;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`; 