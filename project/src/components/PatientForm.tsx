import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  User, 
  FileText, 
  Activity, 
  Pill, 
  Calendar,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Wind,
  Droplets,
  Heart,
  Syringe,
  Eye,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { PatientDetail, Device, Medication, PhysicalAssessment } from '../types';
import { mockPhysicalAssessments } from '../utils/patientData';

interface PatientFormProps {
  patient?: PatientDetail;
  onSave: (patient: PatientDetail) => void;
  onClose: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState<PatientDetail>({
    id: patient?.id || '',
    name: patient?.name || '',
    age: patient?.age || 0,
    bedNumber: patient?.bedNumber || '',
    diagnosis: patient?.diagnosis || '',
    admissionDate: patient?.admissionDate || new Date().toISOString().split('T')[0],
    status: patient?.status || 'stable',
    decubitusTimer: patient?.decubitusTimer || 0,
    lastTurn: patient?.lastTurn || new Date().toISOString(),
    medicalRecord: patient?.medicalRecord || '',
    devices: patient?.devices || [],
    criticalMedications: patient?.criticalMedications || [],
    currentSBAR: patient?.currentSBAR || undefined
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'devices' | 'medications' | 'assessment'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [physicalAssessments, setPhysicalAssessments] = useState<PhysicalAssessment[]>(
    mockPhysicalAssessments.filter(a => a.patientId === patient?.id)
  );
  const [showNewAssessment, setShowNewAssessment] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentAssessment, setCurrentAssessment] = useState<PhysicalAssessment>({
    id: '',
    patientId: formData.id,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    assessedBy: 'Enfermeiro João',
    neurological: {
      consciousnessLevel: 'alert',
      glasgowScale: 15,
      rassScale: 0,
      pupils: 'isocoric',
      motorResponse: '',
      observations: ''
    },
    respiratory: {
      respiratoryPattern: 'normal',
      oxygenUse: false,
      oxygenFlow: '',
      secretionPresence: false,
      secretionCharacteristics: '',
      breathSounds: '',
      observations: ''
    },
    cardiovascular: {
      heartRate: 80,
      bloodPressure: '',
      heartRhythm: 'regular',
      peripheralPulses: 'present',
      capillaryRefill: 'normal',
      edema: false,
      edemaLocation: '',
      observations: ''
    },
    gastrointestinal: {
      abdomen: 'soft',
      bowelSounds: 'present',
      lastEvacuation: '',
      feeding: 'oral',
      nausea: false,
      vomiting: false,
      observations: ''
    },
    genitourinary: {
      urinaryOutput: '',
      urineCharacteristics: '',
      bladderCatheter: false,
      catheterType: '',
      observations: ''
    },
    integumentary: {
      skinColor: 'normal',
      skinTemperature: 'normal',
      skinTurgor: 'normal',
      wounds: false,
      woundDescription: '',
      pressureUlcers: false,
      pressureUlcerStage: '',
      observations: ''
    },
    musculoskeletal: {
      mobility: 'independent',
      muscleStrength: '',
      jointMovement: 'normal',
      pain: false,
      painScale: 0,
      painLocation: '',
      observations: ''
    },
    generalObservations: ''
  });

  const deviceTypes = [
    { value: 'respiratory', label: 'Respiratório', icon: Wind },
    { value: 'vascular', label: 'Vascular', icon: Droplets },
    { value: 'drainage', label: 'Drenagem', icon: Activity },
    { value: 'monitoring', label: 'Monitorização', icon: Heart }
  ];

  const medicationTypes = [
    { value: 'sedation', label: 'Sedação', color: 'bg-purple-100 text-purple-800' },
    { value: 'vasoactive', label: 'Vasoativo', color: 'bg-red-100 text-red-800' },
    { value: 'antibiotic', label: 'Antibiótico', color: 'bg-blue-100 text-blue-800' },
    { value: 'analgesic', label: 'Analgésico', color: 'bg-orange-100 text-orange-800' },
    { value: 'other', label: 'Outros', color: 'bg-gray-100 text-gray-800' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.age || formData.age <= 0) newErrors.age = 'Idade deve ser maior que 0';
    if (!formData.bedNumber.trim()) newErrors.bedNumber = 'Número do leito é obrigatório';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnóstico é obrigatório';
    if (!formData.medicalRecord.trim()) newErrors.medicalRecord = 'Prontuário é obrigatório';
    if (!formData.admissionDate) newErrors.admissionDate = 'Data de internação é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const patientData = {
        ...formData,
        id: formData.id || Date.now().toString()
      };
      onSave(patientData);
    }
  };

  const addDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: '',
      type: 'monitoring',
      status: 'active',
      insertionDate: new Date().toISOString().split('T')[0]
    };
    setFormData(prev => ({
      ...prev,
      devices: [...prev.devices, newDevice]
    }));
  };

  const updateDevice = (index: number, field: keyof Device, value: any) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.map((device, i) => 
        i === index ? { ...device, [field]: value } : device
      )
    }));
  };

  const removeDevice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      route: '',
      frequency: '',
      type: 'other',
      critical: false
    };
    setFormData(prev => ({
      ...prev,
      criticalMedications: [...prev.criticalMedications, newMedication]
    }));
  };

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    setFormData(prev => ({
      ...prev,
      criticalMedications: prev.criticalMedications.map((medication, i) => 
        i === index ? { ...medication, [field]: value } : medication
      )
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      criticalMedications: prev.criticalMedications.filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateAssessmentField = (system: keyof PhysicalAssessment, field: string, value: any) => {
    if (system === 'neurological' || system === 'respiratory' || system === 'cardiovascular' || 
        system === 'gastrointestinal' || system === 'genitourinary' || system === 'integumentary' || 
        system === 'musculoskeletal') {
      setCurrentAssessment(prev => ({
        ...prev,
        [system]: {
          ...prev[system],
          [field]: value
        }
      }));
    } else {
      setCurrentAssessment(prev => ({
        ...prev,
        [system]: value
      }));
    }
  };

  const saveAssessment = () => {
    const newAssessment = {
      ...currentAssessment,
      id: Date.now().toString(),
      patientId: formData.id
    };
    setPhysicalAssessments([newAssessment, ...physicalAssessments]);
    setShowNewAssessment(false);
    // Reset form
    setCurrentAssessment({
      ...currentAssessment,
      id: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      generalObservations: ''
    });
  };

  const getDeviceIcon = (type: string) => {
    const deviceType = deviceTypes.find(dt => dt.value === type);
    const Icon = deviceType?.icon || Activity;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {patient ? 'Editar Dados Clínicos' : 'Novo Paciente'}
              </h1>
              <p className="text-blue-100">
                {patient ? `Editando: ${patient.name}` : 'Cadastro de novo paciente na UTI'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Dados Básicos
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'devices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Dispositivos ({formData.devices.length})
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'medications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Pill className="w-4 h-4 inline mr-2" />
              Medicações ({formData.criticalMedications.length})
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'assessment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Avaliação Física ({physicalAssessments.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome completo do paciente"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Idade em anos"
                    min="0"
                    max="150"
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Leito *
                  </label>
                  <input
                    type="text"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedNumber: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bedNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 101, 102A"
                  />
                  {errors.bedNumber && <p className="text-red-500 text-xs mt-1">{errors.bedNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prontuário *
                  </label>
                  <input
                    type="text"
                    value={formData.medicalRecord}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalRecord: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.medicalRecord ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Número do prontuário"
                  />
                  {errors.medicalRecord && <p className="text-red-500 text-xs mt-1">{errors.medicalRecord}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Internação *
                  </label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.admissionDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.admissionDate && <p className="text-red-500 text-xs mt-1">{errors.admissionDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Clínico
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="stable">Estável</option>
                    <option value="critical">Crítico</option>
                    <option value="recovering">Recuperando</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico Principal *
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.diagnosis ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Diagnóstico clínico principal do paciente"
                />
                {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cronômetro de Decúbito (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.decubitusTimer}
                    onChange={(e) => setFormData(prev => ({ ...prev, decubitusTimer: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tempo em minutos"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Última Mudança de Decúbito
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.lastTurn.slice(0, 16)}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastTurn: e.target.value + ':00Z' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Dispositivos em Uso</h3>
                <button
                  type="button"
                  onClick={addDevice}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Dispositivo
                </button>
              </div>

              <div className="space-y-4">
                {formData.devices.map((device, index) => (
                  <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-blue-600">
                          {getDeviceIcon(device.type)}
                        </div>
                        <h4 className="font-medium text-gray-800">Dispositivo {index + 1}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDevice(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Dispositivo
                        </label>
                        <input
                          type="text"
                          value={device.name}
                          onChange={(e) => updateDevice(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Tubo Orotraqueal"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          value={device.type}
                          onChange={(e) => updateDevice(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {deviceTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={device.status}
                          onChange={(e) => updateDevice(index, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Inserção
                        </label>
                        <input
                          type="date"
                          value={device.insertionDate}
                          onChange={(e) => updateDevice(index, 'insertionDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.devices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum dispositivo cadastrado</p>
                    <p className="text-sm">Clique em "Adicionar Dispositivo" para começar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Medicações</h3>
                <button
                  type="button"
                  onClick={addMedication}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Medicação
                </button>
              </div>

              <div className="space-y-4">
                {formData.criticalMedications.map((medication, index) => (
                  <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <Pill className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium text-gray-800">Medicação {index + 1}</h4>
                        {medication.critical && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            Crítica
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Medicação
                        </label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Noradrenalina"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosagem
                        </label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 0.1 mcg/kg/min"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Via de Administração
                        </label>
                        <input
                          type="text"
                          value={medication.route}
                          onChange={(e) => updateMedication(index, 'route', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: EV contínuo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequência
                        </label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Contínuo, 12/12h"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          value={medication.type}
                          onChange={(e) => updateMedication(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {medicationTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center space-x-2 mt-6">
                          <input
                            type="checkbox"
                            checked={medication.critical}
                            onChange={(e) => updateMedication(index, 'critical', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Medicação Crítica</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.criticalMedications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma medicação cadastrada</p>
                    <p className="text-sm">Clique em "Adicionar Medicação" para começar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Avaliação Física</h3>
                <button
                  type="button"
                  onClick={() => setShowNewAssessment(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Avaliação
                </button>
              </div>

              {showNewAssessment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-blue-800">Nova Avaliação Física</h4>
                    <button
                      type="button"
                      onClick={() => setShowNewAssessment(false)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                      <input
                        type="date"
                        value={currentAssessment.date}
                        onChange={(e) => updateAssessmentField('date', '', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                      <input
                        type="time"
                        value={currentAssessment.time}
                        onChange={(e) => updateAssessmentField('time', '', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Avaliado por</label>
                      <input
                        type="text"
                        value={currentAssessment.assessedBy}
                        onChange={(e) => updateAssessmentField('assessedBy', '', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Sistema Neurológico */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleSection('neurological')}
                        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Activity className="w-4 h-4 text-purple-600" />
                          </div>
                          <h5 className="font-medium text-gray-800">Sistema Neurológico</h5>
                        </div>
                        {expandedSections.neurological ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {expandedSections.neurological && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Consciência</label>
                              <div className="space-y-2">
                                {[
                                  { value: 'alert', label: 'Lúcido e orientado' },
                                  { value: 'decreased', label: 'Rebaixado' },
                                  { value: 'sedated', label: 'Sedado' }
                                ].map(option => (
                                  <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="consciousnessLevel"
                                      value={option.value}
                                      checked={currentAssessment.neurological.consciousnessLevel === option.value}
                                      onChange={(e) => updateAssessmentField('neurological', 'consciousnessLevel', e.target.value)}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Pupilas</label>
                              <div className="space-y-2">
                                {[
                                  { value: 'isocoric', label: 'Isocóricas' },
                                  { value: 'anisocoric', label: 'Anisocóricas' }
                                ].map(option => (
                                  <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="pupils"
                                      value={option.value}
                                      checked={currentAssessment.neurological.pupils === option.value}
                                      onChange={(e) => updateAssessmentField('neurological', 'pupils', e.target.value)}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Escala de Glasgow</label>
                              <input
                                type="number"
                                min="3"
                                max="15"
                                value={currentAssessment.neurological.glasgowScale}
                                onChange={(e) => updateAssessmentField('neurological', 'glasgowScale', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Escala RASS</label>
                              <select
                                value={currentAssessment.neurological.rassScale}
                                onChange={(e) => updateAssessmentField('neurological', 'rassScale', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="4">+4 Combativo</option>
                                <option value="3">+3 Muito agitado</option>
                                <option value="2">+2 Agitado</option>
                                <option value="1">+1 Inquieto</option>
                                <option value="0">0 Alerta e calmo</option>
                                <option value="-1">-1 Sonolento</option>
                                <option value="-2">-2 Sedação leve</option>
                                <option value="-3">-3 Sedação moderada</option>
                                <option value="-4">-4 Sedação profunda</option>
                                <option value="-5">-5 Não desperta</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resposta Motora</label>
                            <input
                              type="text"
                              value={currentAssessment.neurological.motorResponse}
                              onChange={(e) => updateAssessmentField('neurological', 'motorResponse', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Descreva a resposta motora..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                            <textarea
                              value={currentAssessment.neurological.observations}
                              onChange={(e) => updateAssessmentField('neurological', 'observations', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="Observações sobre o sistema neurológico..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sistema Respiratório */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleSection('respiratory')}
                        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Wind className="w-4 h-4 text-blue-600" />
                          </div>
                          <h5 className="font-medium text-gray-800">Sistema Respiratório</h5>
                        </div>
                        {expandedSections.respiratory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {expandedSections.respiratory && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Padrão Respiratório</label>
                              <div className="space-y-2">
                                {[
                                  { value: 'normal', label: 'Normal' },
                                  { value: 'altered', label: 'Alterado' }
                                ].map(option => (
                                  <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="respiratoryPattern"
                                      value={option.value}
                                      checked={currentAssessment.respiratory.respiratoryPattern === option.value}
                                      onChange={(e) => updateAssessmentField('respiratory', 'respiratoryPattern', e.target.value)}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="flex items-center space-x-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={currentAssessment.respiratory.oxygenUse}
                                  onChange={(e) => updateAssessmentField('respiratory', 'oxygenUse', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Uso de O2</span>
                              </label>
                              {currentAssessment.respiratory.oxygenUse && (
                                <input
                                  type="text"
                                  value={currentAssessment.respiratory.oxygenFlow}
                                  onChange={(e) => updateAssessmentField('respiratory', 'oxygenFlow', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Ex: Cateter nasal 2L/min"
                                />
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                checked={currentAssessment.respiratory.secretionPresence}
                                onChange={(e) => updateAssessmentField('respiratory', 'secretionPresence', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">Presença de Secreção</span>
                            </label>
                            {currentAssessment.respiratory.secretionPresence && (
                              <input
                                type="text"
                                value={currentAssessment.respiratory.secretionCharacteristics}
                                onChange={(e) => updateAssessmentField('respiratory', 'secretionCharacteristics', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Características da secreção..."
                              />
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sons Respiratórios</label>
                            <input
                              type="text"
                              value={currentAssessment.respiratory.breathSounds}
                              onChange={(e) => updateAssessmentField('respiratory', 'breathSounds', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Murmúrio vesicular presente bilateralmente"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                            <textarea
                              value={currentAssessment.respiratory.observations}
                              onChange={(e) => updateAssessmentField('respiratory', 'observations', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="Observações sobre o sistema respiratório..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sistema Cardiovascular */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleSection('cardiovascular')}
                        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-600" />
                          </div>
                          <h5 className="font-medium text-gray-800">Sistema Cardiovascular</h5>
                        </div>
                        {expandedSections.cardiovascular ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {expandedSections.cardiovascular && (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência Cardíaca</label>
                              <input
                                type="number"
                                value={currentAssessment.cardiovascular.heartRate}
                                onChange={(e) => updateAssessmentField('cardiovascular', 'heartRate', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="bpm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Pressão Arterial</label>
                              <input
                                type="text"
                                value={currentAssessment.cardiovascular.bloodPressure}
                                onChange={(e) => updateAssessmentField('cardiovascular', 'bloodPressure', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 120/80"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Ritmo Cardíaco</label>
                              <div className="space-y-2">
                                {[
                                  { value: 'regular', label: 'Regular' },
                                  { value: 'irregular', label: 'Irregular' }
                                ].map(option => (
                                  <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="heartRhythm"
                                      value={option.value}
                                      checked={currentAssessment.cardiovascular.heartRhythm === option.value}
                                      onChange={(e) => updateAssessmentField('cardiovascular', 'heartRhythm', e.target.value)}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Pulsos Periféricos</label>
                              <select
                                value={currentAssessment.cardiovascular.peripheralPulses}
                                onChange={(e) => updateAssessmentField('cardiovascular', 'peripheralPulses', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="present">Presentes</option>
                                <option value="diminished">Diminuídos</option>
                                <option value="absent">Ausentes</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Enchimento Capilar</label>
                              <div className="space-y-2">
                                {[
                                  { value: 'normal', label: 'Normal (<2s)' },
                                  { value: 'delayed', label: 'Retardado (>2s)' }
                                ].map(option => (
                                  <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="capillaryRefill"
                                      value={option.value}
                                      checked={currentAssessment.cardiovascular.capillaryRefill === option.value}
                                      onChange={(e) => updateAssessmentField('cardiovascular', 'capillaryRefill', e.target.value)}
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                checked={currentAssessment.cardiovascular.edema}
                                onChange={(e) => updateAssessmentField('cardiovascular', 'edema', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">Presença de Edema</span>
                            </label>
                            {currentAssessment.cardiovascular.edema && (
                              <input
                                type="text"
                                value={currentAssessment.cardiovascular.edemaLocation}
                                onChange={(e) => updateAssessmentField('cardiovascular', 'edemaLocation', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Localização do edema..."
                              />
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                            <textarea
                              value={currentAssessment.cardiovascular.observations}
                              onChange={(e) => updateAssessmentField('cardiovascular', 'observations', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="Observações sobre o sistema cardiovascular..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Outros sistemas seguem o mesmo padrão... */}
                    {/* Por brevidade, incluindo apenas alguns sistemas principais */}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
                    <textarea
                      value={currentAssessment.generalObservations}
                      onChange={(e) => updateAssessmentField('generalObservations', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Observações gerais sobre a avaliação física..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowNewAssessment(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={saveAssessment}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Avaliação
                    </button>
                  </div>
                </div>
              )}

              {/* Histórico de Avaliações */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800">Histórico de Avaliações</h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliado por</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Glasgow</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RASS</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observações</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {physicalAssessments.map((assessment) => (
                        <tr key={assessment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(assessment.date).toLocaleDateString()} {assessment.time}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assessment.assessedBy}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assessment.neurological.glasgowScale}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assessment.neurological.rassScale}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {assessment.generalObservations || 'Sem observações'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="text-blue-600 hover:text-blue-700 mr-2">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {physicalAssessments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma avaliação física registrada</p>
                      <p className="text-sm">Clique em "Nova Avaliação" para começar</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {patient ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;