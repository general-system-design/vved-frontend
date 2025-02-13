import styled from 'styled-components';
import { theme } from '../../styles/theme';

const BannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
`;

const Banner = styled.div`
  background: white;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.large};
  border-top: 1px solid ${theme.colors.text.disabled};
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
`;

const EmergencyText = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  letter-spacing: 0.3px;

  &::before {
    content: '⚕️';
    font-size: 16px;
  }
`;

const EmergencyButton = styled.a`
  background: ${theme.colors.emergency};
  color: white;
  padding: ${theme.spacing.small} ${theme.spacing.large};
  border-radius: ${theme.borderRadius.small};
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 40px;
  transition: all 0.3s ease;
  font-size: 14px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);

  &:hover {
    background: color-mix(in srgb, ${theme.colors.emergency} 85%, black);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    transform: translateY(-1px);
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
          For immediate life-threatening emergencies
        </EmergencyText>
        <EmergencyButton href="tel:000">
          Call 000
        </EmergencyButton>
      </Banner>
    </BannerContainer>
  );
}; 