import React from 'react';
import { RegistrationData } from '../types';
import { getIconComponent } from './SectionIcons';
import { createSectionSummary } from './utils';
import {
  ReviewSection as StyledReviewSection,
  SectionHeaderContent,
  SectionIcon,
  SectionTitle,
  SectionContent,
  NarrativeText,
  DetailsList
} from './styles';

interface ReviewSectionProps {
  sectionName: string;
  registrationData: RegistrationData;
  gpInfo: {
    details: any;
    isLoading: boolean;
  };
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  sectionName,
  registrationData,
  gpInfo
}) => {
  const IconComponent = getIconComponent(sectionName);
  const summary = createSectionSummary(sectionName, registrationData, gpInfo);

  return (
    <StyledReviewSection>
      <SectionHeaderContent>
        <SectionIcon>
          <IconComponent />
        </SectionIcon>
        <SectionTitle>{sectionName}</SectionTitle>
      </SectionHeaderContent>
      <SectionContent>
        <NarrativeText>{summary.narrative}</NarrativeText>
        {summary.details && (
          <DetailsList>
            {summary.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </DetailsList>
        )}
      </SectionContent>
    </StyledReviewSection>
  );
}; 