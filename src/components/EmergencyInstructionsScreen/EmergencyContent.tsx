import { EmergencyCard, Title, Instruction, EmergencyNumber } from './styles';

export const EmergencyContent = () => {
  return (
    <EmergencyCard>
      <Title>Emergency Instructions</Title>
      
      <Instruction>
        Based on your symptoms, you should seek immediate medical attention.
      </Instruction>
      
      <Instruction>
        Please call emergency services immediately:
      </Instruction>
      
      <EmergencyNumber>000</EmergencyNumber>
      
      <Instruction>
        While waiting for emergency services:
      </Instruction>
      
      <ul>
        <li>Stay calm and find a safe place to rest</li>
        <li>Have someone stay with you if possible</li>
        <li>Keep your phone nearby</li>
        <li>Unlock your door for emergency services</li>
      </ul>
    </EmergencyCard>
  );
}; 