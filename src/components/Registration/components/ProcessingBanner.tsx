import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../../styles/theme';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const Container = styled.div<{ $isVisible: boolean }>`
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.text.disabled};
  padding: ${theme.spacing.small} ${theme.spacing.large};
  opacity: ${props => props.$isVisible ? '1' : '0'};
  transform: translateY(${props => props.$isVisible ? '0' : '-10px'});
  transition: all 0.3s ease-out;
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
  overflow: hidden;
  position: relative;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
`;

const StepItem = styled.div<{ $isCompleted: boolean; $isProcessing: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  animation: ${fadeIn} 0.3s ease-out;
  color: ${props => props.$isCompleted ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${props => props.$isProcessing ? '500' : 'normal'};
  padding: ${theme.spacing.small} 0;
  
  ${props => props.$isCompleted && css`
    animation: ${slideUp} 0.3s ease-out forwards;
    animation-delay: 1s;
  `}
`;

const loadingDots = keyframes`
  0%, 20% {
    content: ".";
  }
  40% {
    content: "..";
  }
  60%, 100% {
    content: "...";
  }
`;

const ProcessingText = styled.span<{ $isProcessing: boolean }>`
  display: flex;
  align-items: center;
  
  ${props => props.$isProcessing && css`
    &::after {
      content: "";
      animation: ${loadingDots} 1.5s infinite;
      width: 1.5em;
      display: inline-block;
    }
  `}
`;

const Icon = styled.span<{ $isCompleted: boolean }>`
  color: ${props => props.$isCompleted ? theme.colors.success : theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
  flex-shrink: 0;
`;

export interface ProcessingStep {
  status: string;
  isCompleted: boolean;
  isProcessing?: boolean;
}

interface ProcessingBannerProps {
  isVisible: boolean;
  steps: ProcessingStep[];
}

export const ProcessingBanner = ({ isVisible, steps }: ProcessingBannerProps) => {
  // Filter to show only the most recent completed step and any processing steps
  const visibleSteps = steps.filter((step, index) => {
    if (step.isProcessing) return true;
    if (step.isCompleted) {
      // Only show if it's the most recently completed step
      const nextStep = steps[index + 1];
      return !nextStep || !nextStep.isCompleted;
    }
    return false;
  });

  return (
    <Container $isVisible={isVisible}>
      <StepsList>
        {visibleSteps.map((step, index) => (
          <StepItem 
            key={`${step.status}-${index}`}
            $isCompleted={step.isCompleted}
            $isProcessing={!!step.isProcessing}
          >
            <Icon $isCompleted={step.isCompleted}>
              {step.isCompleted ? '✓' : '○'}
            </Icon>
            <ProcessingText $isProcessing={!!step.isProcessing}>
              {step.status}
            </ProcessingText>
          </StepItem>
        ))}
      </StepsList>
    </Container>
  );
}; 