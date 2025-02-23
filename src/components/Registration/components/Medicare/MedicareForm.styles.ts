import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 0.25rem;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  height: 56px;
  padding: 0 0.75rem;
  border: 1.5px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #2C3E50;
  line-height: 1.5;
  width: 100%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  font-family: inherit;

  &:hover {
    border-color: ${props => props.hasError ? '#dc3545' : '#2C3E50'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#0066CC'};
    box-shadow: 0 0 0 3px white, 0 0 0 5px ${props => props.hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 102, 204, 0.25)'};
  }

  &::placeholder {
    color: #6c757d;
    transition: color 0.2s ease;
    font-size: 0.875rem;
  }

  &:focus::placeholder {
    color: #495057;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

export const SmallInput = styled(Input)`
  width: ${props => props.width || '60px'};
  text-align: center;
`;

export const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
`;

export const HelpText = styled.span`
  color: #6c757d;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
`;

export const InputSection = styled.div`
  margin-bottom: 1rem;
`;

export const SmallInputsRow = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;

  > div {
    flex: 1;
    min-width: 0;
  }
`; 