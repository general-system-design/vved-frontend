import styled from 'styled-components';
import { theme } from '../../styles/theme';

const LogoContainer = styled.div`
  font-family: ${theme.typography.fontFamily.header};
  font-size: 36px;
  color: ${theme.colors.text.primary};
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.5px;
  text-align: center;
  margin-bottom: ${theme.spacing.medium};
  
  span {
    display: block;
    font-size: 32px;
    color: ${theme.colors.primary};
    font-weight: 500;
    margin-top: ${theme.spacing.small};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.h3};
  color: ${theme.colors.text.secondary};
  max-width: 480px;
  margin: 0 auto ${theme.spacing.xlarge};
  line-height: 1.5;
  font-weight: 400;
  text-align: center;
`;

export const Logo = () => {
  return (
    <>
      <LogoContainer>
        Virtual Emergency
        <span>Department</span>
      </LogoContainer>
      <Subtitle>
        Secure, immediate access to emergency medical care from your location
      </Subtitle>
    </>
  );
}; 