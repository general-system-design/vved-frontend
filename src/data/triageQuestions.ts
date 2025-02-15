export type Severity = 'high' | 'medium' | 'low';

export interface TriageQuestion {
  id: string;
  question: string;
  description?: string;
  severity: Severity;
  isEmergencySymptom: boolean;
  followUpQuestions?: string[]; // IDs of questions to ask if answered yes
}

export const triageQuestions: Record<string, TriageQuestion> = {
  'chest-pain': {
    id: 'chest-pain',
    question: 'Are you experiencing chest pain or pressure?',
    description: 'Including tightness, squeezing, or burning sensation in your chest',
    severity: 'high',
    isEmergencySymptom: true,
  },
  'breathing': {
    id: 'breathing',
    question: 'Are you having difficulty breathing?',
    description: 'Feeling short of breath, wheezing, or struggling to catch your breath',
    severity: 'high',
    isEmergencySymptom: true,
  },
  'consciousness': {
    id: 'consciousness',
    question: 'Have you fainted or nearly fainted?',
    description: 'Including feeling lightheaded or dizzy',
    severity: 'high',
    isEmergencySymptom: true,
  },
  'bleeding': {
    id: 'bleeding',
    question: 'Are you experiencing severe bleeding?',
    description: 'Bleeding that will not stop with direct pressure',
    severity: 'high',
    isEmergencySymptom: true,
  },
  'fever': {
    id: 'fever',
    question: 'Do you have a fever?',
    description: 'Temperature above 38°C/100.4°F',
    severity: 'medium',
    isEmergencySymptom: false,
    followUpQuestions: ['fever-duration']
  },
  'fever-duration': {
    id: 'fever-duration',
    question: 'Has your fever lasted more than 3 days?',
    severity: 'medium',
    isEmergencySymptom: false,
  },
  'injury': {
    id: 'injury',
    question: 'Is this related to an injury?',
    severity: 'medium',
    isEmergencySymptom: false,
    followUpQuestions: ['injury-time']
  },
  'injury-time': {
    id: 'injury-time',
    question: 'Did the injury occur in the last 24 hours?',
    severity: 'medium',
    isEmergencySymptom: false,
  }
}; 