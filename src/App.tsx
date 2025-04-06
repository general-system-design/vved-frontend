import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { theme } from './styles/theme';
import { ConsolidatedHomeScreen } from './components/ConsolidatedHomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { RegistrationChoiceScreen } from './components/RegistrationChoiceScreen';
import { TriageQuestionScreen } from './components/TriageQuestionScreen';
import { EmergencyInstructionsScreen } from './components/EmergencyInstructionsScreen';
import { ConversationalRegistration } from './components/Registration/ConversationalRegistration';
import { ConfirmationScreen } from './components/Registration/ConfirmationScreen';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.body};
    line-height: ${theme.typography.lineHeight.body};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul, li {
    list-style-position: inside;
    margin-bottom: ${theme.spacing.small};
  }
`;

// Wrap ConsolidatedHomeScreen to handle navigation
const HomeScreen = () => {
  const navigate = useNavigate();
  
  // Navigate to pre-registration
  const handlePreRegister = () => navigate('/register?type=pre-register');
  
  return (
    <ConsolidatedHomeScreen 
      onPreRegister={handlePreRegister}
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/registration-choice" element={<RegistrationChoiceScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/triage" element={<TriageQuestionScreen />} />
        <Route path="/emergency-instructions" element={<EmergencyInstructionsScreen />} />
        <Route path="/register" element={<ConversationalRegistration />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
