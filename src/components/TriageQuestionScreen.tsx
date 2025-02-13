import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { PageLayout } from './Layout/PageLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { triageQuestions, TriageQuestion, Severity } from '../data/triageQuestions';
import { useState, useEffect } from 'react';
import { EmergencyBanner } from './shared/EmergencyBanner';
import { Header } from './shared/Header';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xlarge};
  padding: ${theme.spacing.xlarge};
  max-width: 500px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  justify-content: center;
  padding-bottom: calc(${theme.spacing.xlarge} * 3);
  position: relative;
`;

const QuestionCard = styled.div<{ severity: Severity; isExiting?: boolean }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xlarge};
  box-shadow: ${theme.shadows.card};
  position: relative;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isExiting ? 0 : 1};
  transform: translateX(${props => props.isExiting ? '-30px' : '0'});
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.primary};
    opacity: 0.8;
    border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.large};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.small};
  font-weight: 500;
`;

const StepCount = styled.span`
  background: ${theme.colors.primary};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const Question = styled.h2`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h2};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.medium};
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: ${theme.typography.fontSize.body};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xlarge};
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.xlarge};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  height: 56px;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  background-color: ${props => 
    props.variant === 'secondary' ? 'rgba(0, 102, 204, 0.05)' : theme.colors.primary};
  color: ${props => 
    props.variant === 'secondary' ? theme.colors.primary : theme.colors.surface};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.h3};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-1px);
    background-color: ${props => 
      props.variant === 'secondary' ? 'rgba(0, 102, 204, 0.1)' : '#0052a3'};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PainScaleContainer = styled.div`
  margin-top: ${theme.spacing.large};
  width: 100%;
  max-width: 370px;
`;

const PainScale = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.medium};
`;

const SliderContainer = styled.div`
  position: relative;
  padding: ${theme.spacing.medium} ${theme.spacing.small};
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.small};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
`;

const SliderInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #22C55E, #84CC16, #F59E0B, #EF4444, #DC2626);
  outline: none;
  margin: ${theme.spacing.medium} 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 2px solid ${theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 2px solid ${theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const SelectedPain = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.medium};
  font-size: ${theme.typography.fontSize.h3};
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

const PainDescription = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.small};
`;

const ProgressSteps = styled.div`
  display: flex;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.xlarge};
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  flex: 1;
  height: 4px;
  background-color: ${props =>
    props.completed
      ? theme.colors.primary
      : props.active
      ? 'rgba(0, 102, 204, 0.3)'
      : 'rgba(203, 213, 225, 0.3)'};
  border-radius: 2px;
  transition: all 0.3s ease;
`;

interface TriageAnswers {
  [questionId: string]: boolean | number;
}

const getSeverityLabel = (severity: Severity): string => {
  switch (severity) {
    case 'high':
      return 'Urgent';
    case 'medium':
      return 'Moderate';
    case 'low':
      return 'Non-urgent';
  }
};

export const TriageQuestionScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentQuestionId, setCurrentQuestionId] = useState('chest-pain');
  const [answers, setAnswers] = useState<TriageAnswers>({});
  const [isExiting, setIsExiting] = useState(false);
  const [selectedPainLevel, setSelectedPainLevel] = useState<number | null>(null);
  
  const isNewUser = searchParams.get('isNew') === 'true';
  const currentQuestion = triageQuestions[currentQuestionId];
  const progress = Object.keys(answers).length * 10 + 30;
  
  const baseQuestions = ['chest-pain', 'breathing', 'consciousness', 'bleeding', 'pain-level'];
  const currentQuestionIndex = baseQuestions.indexOf(currentQuestionId);
  const totalQuestions = baseQuestions.length;

  const handleAnswer = async (answer: boolean | number) => {
    setIsExiting(true);
    const newAnswers = { ...answers, [currentQuestionId]: answer };
    setAnswers(newAnswers);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (answer === true && currentQuestion.isEmergencySymptom) {
      navigate('/emergency-instructions');
      return;
    }
    
    if (answer === true && currentQuestion.followUpQuestions?.length) {
      setCurrentQuestionId(currentQuestion.followUpQuestions[0]);
    } else {
      const currentIndex = baseQuestions.indexOf(currentQuestionId);
      
      if (currentIndex < baseQuestions.length - 1) {
        setCurrentQuestionId(baseQuestions[currentIndex + 1]);
      } else {
        const triageData = JSON.stringify(newAnswers);
        if (isNewUser) {
          navigate(`/register?type=${searchParams.get('type')}&triage=${triageData}`);
        } else {
          navigate(`/confirm?type=${searchParams.get('type')}&triage=${triageData}`);
        }
      }
    }
    
    setTimeout(() => {
      setIsExiting(false);
    }, 50);
  };

  const handlePainSelection = (level: number) => {
    setSelectedPainLevel(level);
    setTimeout(() => handleAnswer(level), 500);
  };
  
  return (
    <PageLayout>
      <div>
        <Header title="Medical Assessment" />
        
        <Container>
          <ProgressSteps>
            {baseQuestions.map((q, index) => (
              <ProgressStep
                key={q}
                active={currentQuestionId === q}
                completed={index < currentQuestionIndex}
              />
            ))}
          </ProgressSteps>

          <QuestionCard severity={currentQuestion.severity} isExiting={isExiting}>
            <StepIndicator>
              <StepCount>{currentQuestionIndex + 1}</StepCount>
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </StepIndicator>
            
            <Question>{currentQuestion.question}</Question>
            {currentQuestion.description && (
              <Description>{currentQuestion.description}</Description>
            )}
            
            {currentQuestionId === 'pain-level' ? (
              <PainScaleContainer>
                <PainScale>
                  <SliderContainer>
                    <SliderLabels>
                      <span>No Pain</span>
                      <span>Worst Pain</span>
                    </SliderLabels>
                    <SliderInput
                      type="range"
                      min="0"
                      max="10"
                      value={selectedPainLevel || 0}
                      onChange={(e) => setSelectedPainLevel(Number(e.target.value))}
                      onMouseUp={() => selectedPainLevel !== null && handlePainSelection(selectedPainLevel)}
                      onTouchEnd={() => selectedPainLevel !== null && handlePainSelection(selectedPainLevel)}
                    />
                    {selectedPainLevel !== null && (
                      <>
                        <SelectedPain>{selectedPainLevel}</SelectedPain>
                        <PainDescription>
                          {selectedPainLevel === 0 && 'No Pain'}
                          {selectedPainLevel >= 1 && selectedPainLevel <= 3 && 'Mild Pain'}
                          {selectedPainLevel >= 4 && selectedPainLevel <= 6 && 'Moderate Pain'}
                          {selectedPainLevel >= 7 && selectedPainLevel <= 9 && 'Severe Pain'}
                          {selectedPainLevel === 10 && 'Extreme Pain'}
                        </PainDescription>
                      </>
                    )}
                  </SliderContainer>
                </PainScale>
              </PainScaleContainer>
            ) : (
              <ButtonGroup>
                <Button onClick={() => handleAnswer(true)}>Yes</Button>
                <Button 
                  variant="secondary" 
                  onClick={() => handleAnswer(false)}
                >
                  No
                </Button>
              </ButtonGroup>
            )}
          </QuestionCard>
        </Container>

        <EmergencyBanner />
      </div>
    </PageLayout>
  );
}; 