import styled from 'styled-components';
import { theme } from '../../styles/theme';

const HeaderContainer = styled.div`
  background: linear-gradient(to right, ${theme.colors.primary}, color-mix(in srgb, ${theme.colors.primary} 85%, white));
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h3};
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};

  &::before {
    content: '⚕️';
    font-size: 20px;
  }
`;

const Logo = styled.img`
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
`;

interface HeaderProps {
  showLogo?: boolean;
  title?: string;
}

export const Header = ({ showLogo = false, title }: HeaderProps) => {
  return (
    <HeaderContainer>
      <HeaderTitle>
        {showLogo ? (
          <Logo src="/vved_logo.png" alt="Virtual Emergency Department" />
        ) : (
          title
        )}
      </HeaderTitle>
    </HeaderContainer>
  );
}; 