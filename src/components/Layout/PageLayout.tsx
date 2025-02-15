import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useLocation } from 'react-router-dom';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background-color: ${theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease-in-out;
  z-index: 1000;
`;

const Content = styled.main`
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;

  @media (min-width: 640px) {
    max-width: 640px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: ${theme.spacing.medium};
  left: ${theme.spacing.medium};
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.small};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  font-size: ${theme.typography.fontSize.body};
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

interface PageLayoutProps {
  children: React.ReactNode;
  progress?: number;
  showBack?: boolean;
  onBack?: () => void;
}

export const PageLayout = ({ 
  children, 
  progress = 0, 
  showBack = false,
  onBack 
}: PageLayoutProps) => {
  const location = useLocation();
  
  return (
    <LayoutContainer>
      {progress > 0 && <ProgressBar progress={progress} />}
      <Content>
        {showBack && location.pathname !== '/' && (
          <BackButton onClick={onBack}>
            ← Back
          </BackButton>
        )}
        {children}
      </Content>
    </LayoutContainer>
  );
}; 