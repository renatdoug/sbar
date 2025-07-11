export interface Patient {
  id: string;
  name: string;
  age: number;
  bedNumber: string;
  diagnosis: string;
  admissionDate: string;
  status: 'stable' | 'critical' | 'recovering';
  decubitusTimer: number; // em minutos
  lastTurn: string;
}

export interface Task {
  id: string;
  patientId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  dueTime: string;
  createdAt: string;
}

export interface SBARRecord {
  id: string;
  patientId: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  createdAt: string;
  shift: 'morning' | 'afternoon' | 'night';
  createdBy: string;
}

export interface Indicator {
  id: string;
  type: 'lpp' | 'falls' | 'extubation' | 'medication';
  location?: string;
  fallType?: string;
  date: string;
  shift: string;
  description: string;
}

export interface ScaleEntry {
  id: string;
  technician: string;
  patient: string;
  date: string;
  shift: string;
  bedNumber: string;
  validated: boolean;
}

export interface PatientDetail extends Patient {
  medicalRecord: string;
  devices: Device[];
  criticalMedications: Medication[];
  currentSBAR?: SBARRecord;
}

export interface Device {
  id: string;
  name: string;
  type: 'respiratory' | 'vascular' | 'drainage' | 'monitoring';
  status: 'active' | 'inactive';
  insertionDate: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  type: 'sedation' | 'vasoactive' | 'antibiotic' | 'analgesic' | 'other';
  critical: boolean;
}

export interface IndicatorChecklist {
  patientId: string;
  date: string;
  shift: string;
  falls: FallsIndicator;
  lpp: LPPIndicator;
  phlebitis: PhlebitisIndicator;
  skinLesions: SkinLesionsIndicator;
  extubation: ExtubationIndicator;
  tubeDisplacement: TubeDisplacementIndicator;
  cvcLoss: CVCLossIndicator;
  medicationErrors: MedicationErrorsIndicator;
  nearMisses: NearMissesIndicator;
  observations: string;
  completedBy: string;
  completedAt: string;
}

export interface FallsIndicator {
  occurred: boolean;
  types: {
    ownHeight: boolean;
    bed: boolean;
    chair: boolean;
    stretcher: boolean;
    lap: boolean;
    crib: boolean;
  };
  date?: string;
  observations?: string;
}

export interface LPPIndicator {
  occurred: boolean;
  locations: {
    sacrococcygeal: boolean;
    heel: boolean;
    occipital: boolean;
    trochanteric: boolean;
    nasalSeptum: boolean;
    ear: boolean;
  };
  date?: string;
  observations?: string;
}

export interface PhlebitisIndicator {
  occurred: boolean;
  severity: 'grade1' | 'grade2' | 'grade3' | null;
  date?: string;
  observations?: string;
}

export interface SkinLesionsIndicator {
  occurred: boolean;
  types: {
    adhesive: boolean;
    oximetry: boolean;
    diaper: boolean;
    extravasation: boolean;
    burns: boolean;
  };
  date?: string;
  observations?: string;
}

export interface ExtubationIndicator {
  occurred: boolean;
  causes: {
    fixationDisplaced: boolean;
    manipulation: boolean;
    agitation: boolean;
  };
  date?: string;
  observations?: string;
}

export interface TubeDisplacementIndicator {
  occurred: boolean;
  causes: {
    fixationDisplaced: boolean;
    manipulation: boolean;
    agitation: boolean;
  };
  date?: string;
  observations?: string;
}

export interface CVCLossIndicator {
  occurred: boolean;
  causes: {
    fixationDisplaced: boolean;
    manipulation: boolean;
    agitation: boolean;
    obstruction: boolean;
    traction: boolean;
  };
  date?: string;
  observations?: string;
}

export interface MedicationErrorsIndicator {
  occurred: boolean;
  types: {
    wrongPatient: boolean;
    wrongDrug: boolean;
    wrongDose: boolean;
    wrongRoute: boolean;
    wrongDilution: boolean;
    wrongTime: boolean;
    allergyIgnored: boolean;
  };
  date?: string;
  observations?: string;
}

export interface NearMissesIndicator {
  occurred: boolean;
  types: {
    wrongPatient: boolean;
    wrongDrug: boolean;
    wrongDose: boolean;
    wrongRoute: boolean;
    wrongDilution: boolean;
    wrongTime: boolean;
    allergyIgnored: boolean;
  };
  date?: string;
  observations?: string;
}

export interface PhysicalAssessment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  assessedBy: string;
  neurological: NeurologicalAssessment;
  respiratory: RespiratoryAssessment;
  cardiovascular: CardiovascularAssessment;
  gastrointestinal: GastrointestinalAssessment;
  genitourinary: GenitourinaryAssessment;
  integumentary: IntegumentaryAssessment;
  musculoskeletal: MusculoskeletalAssessment;
  generalObservations: string;
}

export interface NeurologicalAssessment {
  consciousnessLevel: 'alert' | 'decreased' | 'sedated';
  glasgowScale: number;
  rassScale: number;
  pupils: 'isocoric' | 'anisocoric';
  motorResponse: string;
  observations: string;
}

export interface RespiratoryAssessment {
  respiratoryPattern: 'normal' | 'altered';
  oxygenUse: boolean;
  oxygenFlow: string;
  secretionPresence: boolean;
  secretionCharacteristics: string;
  breathSounds: string;
  observations: string;
}

export interface CardiovascularAssessment {
  heartRate: number;
  bloodPressure: string;
  heartRhythm: 'regular' | 'irregular';
  peripheralPulses: 'present' | 'diminished' | 'absent';
  capillaryRefill: 'normal' | 'delayed';
  edema: boolean;
  edemaLocation: string;
  observations: string;
}

export interface GastrointestinalAssessment {
  abdomen: 'soft' | 'distended' | 'rigid';
  bowelSounds: 'present' | 'diminished' | 'absent';
  lastEvacuation: string;
  feeding: 'oral' | 'enteral' | 'parenteral' | 'fasting';
  nausea: boolean;
  vomiting: boolean;
  observations: string;
}

export interface GenitourinaryAssessment {
  urinaryOutput: string;
  urineCharacteristics: string;
  bladderCatheter: boolean;
  catheterType: string;
  observations: string;
}

export interface IntegumentaryAssessment {
  skinColor: 'normal' | 'pale' | 'cyanotic' | 'jaundiced';
  skinTemperature: 'normal' | 'cold' | 'warm';
  skinTurgor: 'normal' | 'decreased';
  wounds: boolean;
  woundDescription: string;
  pressureUlcers: boolean;
  pressureUlcerStage: string;
  observations: string;
}

export interface MusculoskeletalAssessment {
  mobility: 'independent' | 'assisted' | 'bedridden';
  muscleStrength: string;
  jointMovement: 'normal' | 'limited';
  pain: boolean;
  painScale: number;
  painLocation: string;
  observations: string;
}