import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../../../styles/theme';
import {
  Container as BaseContainer,
  Title as BaseTitle,
  Subtitle as BaseSubtitle,
  Button as BaseButton,
} from '../../ConversationalRegistration.styles';

export const backgroundAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const Container = styled(BaseContainer)<{ isEmergency?: boolean }>`
  max-width: 480px;
  margin: 0 auto;
  padding: ${theme.spacing.large} ${theme.spacing.xlarge};
  min-height: calc(100vh - 80px);
  justify-content: flex-start;
  padding-top: calc(${theme.spacing.xlarge} * 1.5);
  width: 100%;
  position: relative;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    inset: -100vh -100vw;
    z-index: -1;
    background: linear-gradient(
      135deg,
      rgba(66, 153, 225, 0.03) 0%,
      ${props => props.isEmergency ? 
        'rgba(49, 130, 206, 0.1) 25%, rgba(144, 205, 244, 0.06) 50%, rgba(49, 130, 206, 0.1) 75%' :
        'rgba(49, 130, 206, 0.08) 25%, rgba(144, 205, 244, 0.05) 50%, rgba(49, 130, 206, 0.08) 75%'
      },
      rgba(66, 153, 225, 0.03) 100%
    );
    background-size: 400% 400%;
    animation: ${backgroundAnimation} ${props => props.isEmergency ? '20s' : '30s'} ease infinite;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.small};
`;

export const Title = styled(BaseTitle)<{ isEmergency?: boolean }>`
  margin-bottom: ${theme.spacing.medium};
  font-size: ${props => props.isEmergency ? '36px' : '32px'};
  letter-spacing: -0.5px;
  font-weight: ${props => props.isEmergency ? '600' : '500'};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.small};

  ${props => props.isEmergency && css`
    &::before {
      content: '';
      display: inline-block;
      width: 32px;
      height: 32px;
      background: ${theme.colors.emergency};
      border-radius: 50%;
      margin-right: ${theme.spacing.small};
      position: relative;

      &::after {
        content: '✚';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 18px;
        font-weight: bold;
      }
    }
  `}
`;

export const Subtitle = styled(BaseSubtitle)<{ isEmergency?: boolean }>`
  max-width: ${props => props.isEmergency ? '400px' : '360px'};
  margin: 0 auto;
  font-size: ${props => props.isEmergency ? 
    theme.typography.fontSize.h3 : 
    theme.typography.fontSize.body};
  color: ${theme.colors.text.primary};
  line-height: 1.6;
  font-weight: ${props => props.isEmergency ? '500' : '400'};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
  width: 100%;
  margin: ${theme.spacing.medium} 0;
`;

export const Button = styled(BaseButton)<{ variant: 'primary' | 'secondary'; isEmergency?: boolean }>`
  width: 100%;
  height: ${props => props.variant === 'primary' ? '64px' : '56px'};
  font-size: ${props => props.variant === 'primary' ? '18px' : theme.typography.fontSize.body};
  font-weight: ${props => props.variant === 'primary' ? '600' : '500'};
  text-transform: none;
  letter-spacing: 0.3px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.medium};
  
  ${props => props.variant === 'primary' && css`
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 4px 20px rgba(0, 102, 204, 0.15);

    &:hover {
      background: color-mix(in srgb, ${theme.colors.primary} 90%, black);
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(0, 102, 204, 0.25);
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background: white;
    border: 1.5px solid ${theme.colors.text.disabled};
    color: ${theme.colors.text.primary};
    
    &:hover {
      border-color: ${theme.colors.primary};
      background: rgba(0, 102, 204, 0.02);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(1px);
    }
  `}
`; 