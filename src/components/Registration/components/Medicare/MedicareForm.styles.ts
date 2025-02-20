import styled from 'styled-components';
import InputMask from 'react-input-mask';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#0d6efd'};
    box-shadow: 0 0 0 0.2rem ${props => props.hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
  }

  &::placeholder {
    color: #6c757d;
  }
`;

export const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const HelpText = styled.span`
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SmallInput = styled(Input)`
  max-width: 120px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.variant === 'primary' ? '#0d6efd' : '#6c757d'};
  color: white;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledInputMask = styled(InputMask)<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#0d6efd'};
    box-shadow: 0 0 0 0.2rem ${props => props.hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
  }

  &::placeholder {
    color: #6c757d;
  }
`; 