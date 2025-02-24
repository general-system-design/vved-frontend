import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../Layout/PageLayout';
import { Container, Button } from './styles';
import { EmergencyContent } from './EmergencyContent';

export const EmergencyInstructionsScreen = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout progress={100}>
      <Container>
        <EmergencyContent />
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Container>
    </PageLayout>
  );
}; 