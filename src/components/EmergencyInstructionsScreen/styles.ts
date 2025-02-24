import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xlarge};
  padding: ${theme.spacing.xlarge};
  max-width: 400px;
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
`;

export const EmergencyCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xlarge};
  box-shadow: ${theme.shadows.card};
  border: 2px solid ${theme.colors.emergency};
`;

export const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h1};
  color: ${theme.colors.emergency};
  margin-bottom: ${theme.spacing.large};
  text-align: center;
`;

export const Instruction = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
  line-height: 1.5;
`;

export const EmergencyNumber = styled.div`
  background: ${theme.colors.emergency};
  color: ${theme.colors.surface};
  font-size: ${theme.typography.fontSize.h1};
  font-weight: bold;
  text-align: center;
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius.medium};
  margin: ${theme.spacing.large} 0;
`;

export const Button = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.surface};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.h3};
  font-weight: 600;
  cursor: pointer;
  margin-top: ${theme.spacing.large};
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`; 