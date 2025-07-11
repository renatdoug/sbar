import { Patient, Task, SBARRecord, Indicator, ScaleEntry } from '../types';
import { PatientDetail, Device, Medication } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'João Silva',
    age: 65,
    bedNumber: '101',
    diagnosis: 'Pneumonia grave',
    admissionDate: '2024-01-15',
    status: 'critical',
    decubitusTimer: 85,
    lastTurn: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    age: 72,
    bedNumber: '102',
    diagnosis: 'Pós-operatório cardíaco',
    admissionDate: '2024-01-18',
    status: 'stable',
    decubitusTimer: 45,
    lastTurn: '2024-01-20T15:15:00Z'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    age: 58,
    bedNumber: '103',
    diagnosis: 'AVC isquêmico',
    admissionDate: '2024-01-19',
    status: 'recovering',
    decubitusTimer: 120,
    lastTurn: '2024-01-20T13:00:00Z'
  },
  {
    id: '4',
    name: 'Ana Costa',
    age: 45,
    bedNumber: '104',
    diagnosis: 'Insuficiência respiratória',
    admissionDate: '2024-01-17',
    status: 'critical',
    decubitusTimer: 95,
    lastTurn: '2024-01-20T14:05:00Z'
  },
  {
    id: '5',
    name: 'Roberto Lima',
    age: 69,
    bedNumber: '105',
    diagnosis: 'Sepse',
    admissionDate: '2024-01-16',
    status: 'stable',
    decubitusTimer: 30,
    lastTurn: '2024-01-20T15:30:00Z'
  },
  {
    id: '6',
    name: 'Lucia Ferreira',
    age: 78,
    bedNumber: '106',
    diagnosis: 'Pneumonia aspirativa',
    admissionDate: '2024-01-20',
    status: 'critical',
    decubitusTimer: 75,
    lastTurn: '2024-01-20T14:45:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    patientId: '1',
    title: 'Mudança de decúbito',
    description: 'Mudança de posição do paciente',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Enfermeiro João',
    dueTime: '16:00',
    createdAt: '2024-01-20T15:00:00Z'
  },
  {
    id: '2',
    patientId: '2',
    title: 'Administração de medicação',
    description: 'Administrar antibiótico prescrito',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Enfermeiro Maria',
    dueTime: '16:30',
    createdAt: '2024-01-20T15:30:00Z'
  }
];

export const mockSBARRecords: SBARRecord[] = [
  {
    id: '1',
    patientId: '1',
    situation: 'Paciente apresentando dispneia e saturação baixa',
    background: 'Pneumonia grave, internado há 5 dias',
    assessment: 'Sinais vitais instáveis, necessita monitoramento contínuo',
    recommendation: 'Aumentar FiO2 e reavaliar em 2 horas',
    createdAt: '2024-01-20T14:00:00Z',
    shift: 'afternoon',
    createdBy: 'Enfermeiro João'
  }
];

export const mockIndicators: Indicator[] = [
  {
    id: '1',
    type: 'lpp',
    location: 'sacro',
    date: '2024-01-20',
    shift: 'morning',
    description: 'LPP estágio 2 em região sacral'
  },
  {
    id: '2',
    type: 'falls',
    fallType: 'cama',
    date: '2024-01-19',
    shift: 'night',
    description: 'Queda do leito durante mudança de posição'
  },
  {
    id: '3',
    type: 'extubation',
    date: '2024-01-18',
    shift: 'afternoon',
    description: 'Extubação acidental durante procedimento'
  },
  {
    id: '4',
    type: 'medication',
    date: '2024-01-17',
    shift: 'morning',
    description: 'Erro de dosagem identificado antes da administração'
  }
];

export const mockScaleEntries: ScaleEntry[] = [
  {
    id: '1',
    technician: 'João Silva',
    patient: 'Maria Santos',
    date: '2024-01-20',
    shift: 'morning',
    bedNumber: '102',
    validated: true
  },
  {
    id: '2',
    technician: 'Ana Costa',
    patient: 'Carlos Oliveira',
    date: '2024-01-20',
    shift: 'afternoon',
    bedNumber: '103',
    validated: false
  }
]