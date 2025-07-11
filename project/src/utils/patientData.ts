import { PatientDetail, Device, Medication } from '../types';
import { PhysicalAssessment } from '../types';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Tubo Orotraqueal',
    type: 'respiratory',
    status: 'active',
    insertionDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Cateter Venoso Central',
    type: 'vascular',
    status: 'active',
    insertionDate: '2024-01-16'
  },
  {
    id: '3',
    name: 'Sonda Nasogástrica',
    type: 'drainage',
    status: 'active',
    insertionDate: '2024-01-17'
  },
  {
    id: '4',
    name: 'Dreno Torácico',
    type: 'drainage',
    status: 'active',
    insertionDate: '2024-01-18'
  }
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Noradrenalina',
    dosage: '0.1 mcg/kg/min',
    route: 'EV contínuo',
    frequency: 'Contínuo',
    type: 'vasoactive',
    critical: true
  },
  {
    id: '2',
    name: 'Midazolam',
    dosage: '2 mg/h',
    route: 'EV contínuo',
    frequency: 'Contínuo',
    type: 'sedation',
    critical: true
  },
  {
    id: '3',
    name: 'Vancomicina',
    dosage: '1g',
    route: 'EV',
    frequency: '12/12h',
    type: 'antibiotic',
    critical: false
  },
  {
    id: '4',
    name: 'Fentanil',
    dosage: '50 mcg/h',
    route: 'EV contínuo',
    frequency: 'Contínuo',
    type: 'analgesic',
    critical: true
  }
];

export const mockPatientDetail: PatientDetail = {
  id: '1',
  name: 'João Silva',
  age: 65,
  bedNumber: '101',
  diagnosis: 'Pneumonia grave com insuficiência respiratória aguda',
  admissionDate: '2024-01-15',
  status: 'critical',
  decubitusTimer: 85,
  lastTurn: '2024-01-20T14:30:00Z',
  medicalRecord: '2024001234',
  devices: mockDevices,
  criticalMedications: mockMedications,
  currentSBAR: {
    id: '1',
    patientId: '1',
    situation: 'Paciente apresentando dispneia e saturação baixa (88% em FiO2 60%)',
    background: 'Pneumonia grave, internado há 5 dias, em ventilação mecânica',
    assessment: 'Sinais vitais instáveis, necessita monitoramento contínuo. PA: 90/60, FC: 110, Tax: 38.5°C',
    recommendation: 'Aumentar FiO2 para 70%, reavaliar gasometria em 2 horas, considerar ajuste de PEEP',
    createdAt: '2024-01-20T14:00:00Z',
    shift: 'afternoon',
    createdBy: 'Enfermeiro João'
  }
};

export const mockPhysicalAssessments: PhysicalAssessment[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-01-20',
    time: '14:00',
    assessedBy: 'Enfermeiro João',
    neurological: {
      consciousnessLevel: 'sedated',
      glasgowScale: 10,
      rassScale: -2,
      pupils: 'isocoric',
      motorResponse: 'Responde a estímulos dolorosos',
      observations: 'Paciente sedado conforme protocolo'
    },
    respiratory: {
      respiratoryPattern: 'altered',
      oxygenUse: true,
      oxygenFlow: 'VM - FiO2 60%',
      secretionPresence: true,
      secretionCharacteristics: 'Secreção amarelada, espessa',
      breathSounds: 'Roncos difusos bilateralmente',
      observations: 'Necessita aspiração frequente'
    },
    cardiovascular: {
      heartRate: 110,
      bloodPressure: '90/60',
      heartRhythm: 'regular',
      peripheralPulses: 'present',
      capillaryRefill: 'normal',
      edema: false,
      edemaLocation: '',
      observations: 'Em uso de noradrenalina'
    },
    gastrointestinal: {
      abdomen: 'soft',
      bowelSounds: 'diminished',
      lastEvacuation: 'Ontem',
      feeding: 'enteral',
      nausea: false,
      vomiting: false,
      observations: 'Dieta enteral por SNG'
    },
    genitourinary: {
      urinaryOutput: '50ml/h',
      urineCharacteristics: 'Amarelo claro',
      bladderCatheter: true,
      catheterType: 'Foley 16Fr',
      observations: 'Débito urinário adequado'
    },
    integumentary: {
      skinColor: 'pale',
      skinTemperature: 'normal',
      skinTurgor: 'normal',
      wounds: false,
      woundDescription: '',
      pressureUlcers: true,
      pressureUlcerStage: 'Estágio II em região sacral',
      observations: 'Curativo com hidrocoloide'
    },
    musculoskeletal: {
      mobility: 'bedridden',
      muscleStrength: 'Diminuída',
      jointMovement: 'limited',
      pain: false,
      painScale: 0,
      painLocation: '',
      observations: 'Mudança de decúbito a cada 2h'
    },
    generalObservations: 'Paciente estável dentro do quadro clínico atual. Manter cuidados intensivos.'
  }
];