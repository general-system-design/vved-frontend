import styled from 'styled-components';
import { theme } from '../styles/theme';
import { PageLayout } from './Layout/PageLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.large};
  padding: ${theme.spacing.xlarge};
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.header};
  font-size: ${theme.typography.fontSize.h1};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.text.secondary};
`;

const Input = styled.input`
  height: 56px;
  padding: 0 ${theme.spacing.medium};
  border: 1.5px solid ${theme.colors.text.disabled};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.body};
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Button = styled.button`
  height: 56px;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.surface};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.h3};
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const HelpLink = styled.a`
  text-align: center;
  color: ${theme.colors.primary};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.small};
  
  &:hover {
    text-decoration: underline;
  }
`;

export const AuthScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmergency = searchParams.get('type') === 'emergency';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle authentication here
    navigate('/triage');
  };
  
  return (
    <PageLayout 
      progress={20} 
      showBack 
      onBack={() => navigate('/registration-choice?type=' + searchParams.get('type'))}
    >
      <Form onSubmit={handleSubmit}>
        <Title>
          {isEmergency ? 'Quick Verification' : 'Verify Your Identity'}
        </Title>
        
        <InputGroup>
          <Label>Medicare Number</Label>
          <Input 
            type="text" 
            placeholder="Enter your Medicare number"
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Date of Birth</Label>
          <Input 
            type="date" 
            required
          />
        </InputGroup>
        
        <Button type="submit">
          {isEmergency ? 'Continue to Symptoms' : 'Continue'}
        </Button>
        
        <HelpLink href="#">Need Help?</HelpLink>
      </Form>
    </PageLayout>
  );
}; 