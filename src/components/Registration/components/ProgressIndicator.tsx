import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { fadeIn } from '../ConversationalRegistration.styles';

interface ProgressIndicatorProps {
  currentSection: string;
  totalSections: number;
  currentSectionNumber: number;
  questionsInSection: number;
  currentQuestionInSection: number;
  nextSection?: string;
  isLastQuestionInSection: boolean;
}

const ProgressContainer = styled.div`
  position: relative;
  padding: 0 ${theme.spacing.medium} ${theme.spacing.small};
  margin-bottom: ${theme.spacing.small};
  animation: ${fadeIn} 0.3s ease-out;

  @media (min-width: 768px) {
    padding: 0 ${theme.spacing.medium} ${theme.spacing.small};
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  margin-bottom: ${theme.spacing.small};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${theme.colors.primary};
  transition: width 0.3s ease-out;
`;

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.base};
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ProgressText = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.medium};
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
`;

const SectionInfo = styled.div`
  font-weight: 500;
`;

const QuestionCount = styled.div`
  opacity: 0.8;
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background: ${theme.colors.text.disabled};
  margin: 0 ${theme.spacing.small};
`;

const NextSectionIndicator = styled.div<{ show: boolean }>`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.disabled};
  opacity: ${props => props.show ? '0.8' : '0'};
  transform: translateY(${props => props.show ? '0' : '4px'});
  transition: all 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};

  &::before {
    content: '→';
    opacity: 0.5;
  }
`;

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentSection,
  totalSections,
  currentSectionNumber,
  questionsInSection,
  currentQuestionInSection,
  nextSection,
  isLastQuestionInSection
}) => {
  const sectionProgress = (currentSectionNumber / totalSections) * 100;
  const showNext = !!(isLastQuestionInSection && nextSection);
  
  return (
    <ProgressContainer>
      <ProgressBar>
        <ProgressFill progress={sectionProgress} />
      </ProgressBar>
      <ProgressInfo>
        <ProgressText>
          <SectionInfo>
            Section {currentSectionNumber} of {totalSections}: {currentSection}
          </SectionInfo>
          <Divider />
          <QuestionCount>
            {currentQuestionInSection} of {questionsInSection}
          </QuestionCount>
        </ProgressText>
        {showNext && (
          <NextSectionIndicator show={showNext}>
            Next: {nextSection}
          </NextSectionIndicator>
        )}
      </ProgressInfo>
    </ProgressContainer>
  );
}; 