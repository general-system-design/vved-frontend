import { useMemo } from 'react';
import { RegistrationStep, RegistrationData } from '../types/index';
import { registrationSteps } from '../steps';

interface SectionInfo {
  name: string;
  steps: RegistrationStep[];
}

export const useRegistrationProgress = (
  currentStep: RegistrationStep,
  formData: Partial<RegistrationData> = {}
) => {
  // First, determine which sections will be visible based on current form data
  const visibleSections = useMemo(() => {
    const sections: SectionInfo[] = [];
    let currentSection = null as SectionInfo | null;

    registrationSteps.forEach(step => {
      // Start a new section if needed
      if (!currentSection || currentSection.name !== (step.section || 'General')) {
        if (currentSection !== null && currentSection.steps.length > 0) {
          sections.push({ ...currentSection });
        }
        currentSection = {
          name: step.section || 'General',
          steps: [] as RegistrationStep[]
        };
      }

      // Only include steps that aren't skipped based on current form data
      const shouldSkip = step.skipIf ? step.skipIf(formData as RegistrationData) : false;
      if (!shouldSkip && currentSection !== null) {
        currentSection.steps.push(step);
      }
    });

    // Add the last section if it has steps
    if (currentSection !== null && currentSection.steps.length > 0) {
      sections.push({ ...currentSection });
    }

    return sections;
  }, [formData]);

  // Now calculate current progress based on visible sections
  const progress = useMemo(() => {
    const sectionIndex = visibleSections.findIndex(s => s.name === (currentStep.section || 'General'));
    if (sectionIndex === -1) return null;

    const currentSection = visibleSections[sectionIndex];
    const nextSection = visibleSections[sectionIndex + 1];

    // Count visible question cards in current section
    const visibleCards = currentSection.steps.reduce((count, step, index, steps) => {
      // Skip counting if this is part of a previous card
      if (step.skipQuestion) return count;
      if (step.isDateField && index > 0 && steps[index - 1].isDateField) return count;
      return count + 1;
    }, 0);

    // Find current card number
    let currentCard = 0;
    let isLastCard = false;
    
    for (let i = 0; i < currentSection.steps.length; i++) {
      const step = currentSection.steps[i];
      
      // If we found our current step
      if (step.id === currentStep.id) {
        // For grouped questions (date fields or multifields)
        if (step.isDateField || step.skipQuestion) {
          // Find the first step of this group
          let groupStart = i;
          while (groupStart > 0 && 
                 ((step.isDateField && currentSection.steps[groupStart - 1].isDateField) ||
                  (step.skipQuestion && currentSection.steps[groupStart - 1].skipQuestion))) {
            groupStart--;
          }
          currentCard = currentSection.steps.slice(0, groupStart)
            .filter(s => !s.skipQuestion && (!s.isDateField || 
              (s.isDateField && (groupStart === 0 || !currentSection.steps[groupStart - 1].isDateField))))
            .length + 1;
        } else {
          currentCard = currentSection.steps.slice(0, i)
            .filter(s => !s.skipQuestion && (!s.isDateField || 
              (s.isDateField && (i === 0 || !currentSection.steps[i - 1].isDateField))))
            .length + 1;
        }

        // Check if this is the last card
        const remainingSteps = currentSection.steps.slice(i + 1);
        isLastCard = remainingSteps.every(s => s.skipQuestion || 
          (s.isDateField && currentSection.steps[i].isDateField));
        break;
      }
    }

    return {
      currentSection: currentSection.name,
      totalSections: visibleSections.length,
      currentSectionNumber: sectionIndex + 1,
      questionsInSection: visibleCards,
      currentQuestionInSection: currentCard,
      nextSection: nextSection?.name,
      isLastQuestionInSection: isLastCard
    };
  }, [currentStep, visibleSections]);

  return progress || {
    currentSection: currentStep.section || 'General',
    totalSections: visibleSections.length,
    currentSectionNumber: 1,
    questionsInSection: 1,
    currentQuestionInSection: 1,
    nextSection: visibleSections[1]?.name,
    isLastQuestionInSection: true
  };
}; 