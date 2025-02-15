import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const subtlePulse = keyframes`
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const BannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  animation: ${slideUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Banner = styled.div`
  background: white;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.small};
  border-top: 1px solid rgba(220, 38, 38, 0.1);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  max-width: 800px;
  min-width: 800px;
  margin: 0 auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${theme.colors.emergency};
    opacity: 0.9;
  }

  @media (max-width: 800px) {
    min-width: 100%;
    margin: 0;
  }
`;

const EmergencyIcon = styled.div`
  width: 18px;
  height: 18px;
  border: 1.5px solid ${theme.colors.emergency};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.emergency};
  font-size: 11px;
  font-weight: bold;
  position: relative;
  animation: ${subtlePulse} 2.5s ease-in-out infinite;
  flex-shrink: 0;
  margin-right: ${theme.spacing.small};

  &::before {
    content: '!';
    position: relative;
    top: -0.5px;
  }
`;

const EmergencyText = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  letter-spacing: 0.2px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmergencyButton = styled.a`
  background: ${theme.colors.emergency};
  color: white;
  padding: calc(${theme.spacing.small} / 2) ${theme.spacing.medium};
  border-radius: ${theme.borderRadius.small};
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  height: 32px;
  transition: all 0.2s ease;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  margin-left: ${theme.spacing.small};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 55%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover {
    background: color-mix(in srgb, ${theme.colors.emergency} 90%, black);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);

    &::before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const EmergencyBanner = () => {
  return (
    <BannerContainer>
      <Banner>
        <EmergencyText>
          <EmergencyIcon />
          For life-threatening emergencies:
        </EmergencyText>
        <EmergencyButton href="tel:000">
          Call 000
        </EmergencyButton>
      </Banner>
    </BannerContainer>
  );
}; 