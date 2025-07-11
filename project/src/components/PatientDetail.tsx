import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Pill, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Syringe,
  Droplets,
  Wind,
  Heart,
  Eye,
  Save,
  FileDown,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';
import { PatientDetail as PatientDetailType, IndicatorChecklist } from '../types';
import { mockPatientDetail } from '../utils/patientData';

interface PatientDetailProps {
  patientId: string;
  onClose: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'clinical' | 'indicators'>('clinical');
  const [patient] = useState<PatientDetailType>(mockPatientDetail);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [checklist, setChecklist] = useState<IndicatorChecklist>({
    patientId,
    date: new Date().toISOString().split('T')[0],
    shift: 'afternoon',
    falls: { occurred: false, types: { ownHeight: false, bed: false, chair: false, stretcher: false, lap: false, crib: false } },
    lpp: { occurred: false, locations: { sacrococcygeal: false, heel: false, occipital: false, trochanteric: false, nasalSeptum: false, ear: false } },
    phlebitis: { occurred: false, severity: null },
    skinLesions: { occurred: false, types: { adhesive: false, oximetry: false, diaper: false, extravasation: false, burns: false } },
    extubation: { occurred: false, causes: { fixationDisplaced: false, manipulation: false, agitation: false } },
    tubeDisplacement: { occurred: false, causes: { fixationDisplaced: false, manipulation: false, agitation: false } },
    cvcLoss: { occurred: false, causes: { fixationDisplaced: false, manipulation: false, agitation: false, obstruction: false, traction: false } },
    medicationErrors: { occurred: false, types: { wrongPatient: false, wrongDrug: false, wrongDose: false, wrongRoute: false, wrongDilution: false, wrongTime: false, allergyIgnored: false } },
    nearMisses: { occurred: false, types: { wrongPatient: false, wrongDrug: false, wrongDose: false, wrongRoute: false, wrongDilution: false, wrongTime: false, allergyIgnored: false } },
    observations: '',
    completedBy: 'Enfermeiro João',
    completedAt: new Date().toISOString()
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'respiratory': return <Wind className="w-5 h-5" />;
      case 'vascular': return <Droplets className="w-5 h-5" />;
      case 'drainage': return <Activity className="w-5 h-5" />;
      case 'monitoring': return <Heart className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getMedicationTypeColor = (type: string) => {
    switch (type) {
      case 'vasoactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'sedation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'antibiotic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analgesic': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateChecklistField = (section: keyof IndicatorChecklist, field: string, value: any) => {
    setChecklist(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (section: keyof IndicatorChecklist, category: string, field: string, value: any) => {
    setChecklist(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [category]: {
          ...prev[section][category],
          [field]: value
        }
      }
    }));
  };

  const saveIndicators = () => {
    console.log('Salvando indicadores:', checklist);
    alert('Indicadores salvos com sucesso!');
  };

  const generatePDF = () => {
    console.log('Gerando PDF para:', patient.name);
    alert('PDF gerado com sucesso!');
  };

  const IndicatorSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: string;
    children: React.ReactNode;
    hasOccurrence?: boolean;
  }> = ({ title, icon, sectionKey, children, hasOccurrence = false }) => {
    const isExpanded = expandedSections[sectionKey];
    const statusColor = hasOccurrence ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50';

    return (
      <div className={`border-2 rounded-lg transition-all duration-200 ${statusColor}`}>
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${hasOccurrence ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {icon}
            </div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {hasOccurrence && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                Evento Registrado
              </span>
            )}
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{patient.name}</h1>
              <div className="flex items-center space-x-6 text-blue-100">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {patient.age} anos
                </span>
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Prontuário: {patient.medicalRecord}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Leito {patient.bedNumber}
                </span>
              </div>
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
              onClick={() => setActiveTab('clinical')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'clinical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Dados Clínicos
            </button>
            <button
              onClick={() => setActiveTab('indicators')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'indicators'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Checklist de Indicadores
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'clinical' && (
            <div className="space-y-6">
              {/* Diagnóstico */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Diagnóstico Principal</h3>
                <p className="text-blue-700">{patient.diagnosis}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dispositivos */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Dispositivos em Uso
                  </h3>
                  <div className="space-y-3">
                    {patient.devices.map(device => (
                      <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-600">
                            {getDeviceIcon(device.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{device.name}</p>
                            <p className="text-sm text-gray-600">
                              Inserido em {new Date(device.insertionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {device.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medicações Críticas */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-red-600" />
                    Medicações Críticas
                  </h3>
                  <div className="space-y-3">
                    {patient.criticalMedications.filter(med => med.critical).map(medication => (
                      <div key={medication.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{medication.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMedicationTypeColor(medication.type)}`}>
                            {medication.type === 'vasoactive' ? 'Vasoativo' :
                             medication.type === 'sedation' ? 'Sedação' :
                             medication.type === 'analgesic' ? 'Analgésico' : medication.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Dose:</strong> {medication.dosage}</p>
                          <p><strong>Via:</strong> {medication.route}</p>
                          <p><strong>Frequência:</strong> {medication.frequency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SBAR Atual */}
              {patient.currentSBAR && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      SBAR Atual
                    </h3>
                    <button className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <History className="w-4 h-4 mr-1" />
                      Ver Histórico
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-blue-600 mb-1">Situação</h4>
                        <p className="text-sm text-gray-700">{patient.currentSBAR.situation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">Background</h4>
                        <p className="text-sm text-gray-700">{patient.currentSBAR.background}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-1">Assessment</h4>
                        <p className="text-sm text-gray-700">{patient.currentSBAR.assessment}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">Recommendation</h4>
                        <p className="text-sm text-gray-700">{patient.currentSBAR.recommendation}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    Registrado por {patient.currentSBAR.createdBy} em {new Date(patient.currentSBAR.createdAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'indicators' && (
            <div className="space-y-4">
              {/* Quedas */}
              <IndicatorSection
                title="Quedas"
                icon={<AlertTriangle className="w-5 h-5" />}
                sectionKey="falls"
                hasOccurrence={checklist.falls.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.falls.occurred}
                      onChange={(e) => updateChecklistField('falls', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu evento de queda</span>
                  </label>
                  
                  {checklist.falls.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries({
                          ownHeight: 'Própria altura',
                          bed: 'Cama',
                          chair: 'Cadeira',
                          stretcher: 'Maca',
                          lap: 'Colo/Canguru',
                          crib: 'Berço'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.falls.types[key as keyof typeof checklist.falls.types]}
                              onChange={(e) => updateNestedField('falls', 'types', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.falls.date || ''}
                          onChange={(e) => updateChecklistField('falls', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.falls.observations || ''}
                          onChange={(e) => updateChecklistField('falls', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* LPP */}
              <IndicatorSection
                title="Lesão por Pressão (LPP - novos casos)"
                icon={<Eye className="w-5 h-5" />}
                sectionKey="lpp"
                hasOccurrence={checklist.lpp.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.lpp.occurred}
                      onChange={(e) => updateChecklistField('lpp', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu nova LPP</span>
                  </label>
                  
                  {checklist.lpp.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries({
                          sacrococcygeal: 'Sacrococcígena',
                          heel: 'Calcâneo',
                          occipital: 'Occipital',
                          trochanteric: 'Trocantérica',
                          nasalSeptum: 'Septo Nasal',
                          ear: 'Orelha'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.lpp.locations[key as keyof typeof checklist.lpp.locations]}
                              onChange={(e) => updateNestedField('lpp', 'locations', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.lpp.date || ''}
                          onChange={(e) => updateChecklistField('lpp', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.lpp.observations || ''}
                          onChange={(e) => updateChecklistField('lpp', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Flebite */}
              <IndicatorSection
                title="Flebite (novos casos)"
                icon={<Syringe className="w-5 h-5" />}
                sectionKey="phlebitis"
                hasOccurrence={checklist.phlebitis.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.phlebitis.occurred}
                      onChange={(e) => updateChecklistField('phlebitis', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu flebite</span>
                  </label>
                  
                  {checklist.phlebitis.occurred && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Grau de Severidade</label>
                        <select
                          value={checklist.phlebitis.severity || ''}
                          onChange={(e) => updateChecklistField('phlebitis', 'severity', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Selecione o grau</option>
                          <option value="grade1">Grau I</option>
                          <option value="grade2">Grau II</option>
                          <option value="grade3">Grau III</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.phlebitis.date || ''}
                          onChange={(e) => updateChecklistField('phlebitis', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.phlebitis.observations || ''}
                          onChange={(e) => updateChecklistField('phlebitis', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Lesões de Pele */}
              <IndicatorSection
                title="Lesões de Pele (novos casos)"
                icon={<Activity className="w-5 h-5" />}
                sectionKey="skinLesions"
                hasOccurrence={checklist.skinLesions.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.skinLesions.occurred}
                      onChange={(e) => updateChecklistField('skinLesions', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu lesão de pele</span>
                  </label>
                  
                  {checklist.skinLesions.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries({
                          adhesive: 'Adesivos',
                          oximetry: 'Oximetria',
                          diaper: 'Dermatite de fraldas',
                          extravasation: 'Extravasamento',
                          burns: 'Queimaduras'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.skinLesions.types[key as keyof typeof checklist.skinLesions.types]}
                              onChange={(e) => updateNestedField('skinLesions', 'types', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.skinLesions.date || ''}
                          onChange={(e) => updateChecklistField('skinLesions', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.skinLesions.observations || ''}
                          onChange={(e) => updateChecklistField('skinLesions', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Extubações não programadas */}
              <IndicatorSection
                title="Extubações não programadas"
                icon={<Wind className="w-5 h-5" />}
                sectionKey="extubation"
                hasOccurrence={checklist.extubation.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.extubation.occurred}
                      onChange={(e) => updateChecklistField('extubation', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu extubação não programada</span>
                  </label>
                  
                  {checklist.extubation.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries({
                          fixationDisplaced: 'Fixação deslocada',
                          manipulation: 'Manipulação/procedimento',
                          agitation: 'Agitação'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.extubation.causes[key as keyof typeof checklist.extubation.causes]}
                              onChange={(e) => updateNestedField('extubation', 'causes', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.extubation.date || ''}
                          onChange={(e) => updateChecklistField('extubation', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.extubation.observations || ''}
                          onChange={(e) => updateChecklistField('extubation', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Saída não planejada de sonda */}
              <IndicatorSection
                title="Saída não planejada de sonda (SNG/SNE)"
                icon={<Activity className="w-5 h-5" />}
                sectionKey="tubeDisplacement"
                hasOccurrence={checklist.tubeDisplacement.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.tubeDisplacement.occurred}
                      onChange={(e) => updateChecklistField('tubeDisplacement', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu saída não planejada de sonda</span>
                  </label>
                  
                  {checklist.tubeDisplacement.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries({
                          fixationDisplaced: 'Fixação deslocada',
                          manipulation: 'Manipulação/procedimento',
                          agitation: 'Agitação'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.tubeDisplacement.causes[key as keyof typeof checklist.tubeDisplacement.causes]}
                              onChange={(e) => updateNestedField('tubeDisplacement', 'causes', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.tubeDisplacement.date || ''}
                          onChange={(e) => updateChecklistField('tubeDisplacement', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.tubeDisplacement.observations || ''}
                          onChange={(e) => updateChecklistField('tubeDisplacement', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Perda de Acesso Venoso Central */}
              <IndicatorSection
                title="Perda de Acesso Venoso Central (CVC)"
                icon={<Droplets className="w-5 h-5" />}
                sectionKey="cvcLoss"
                hasOccurrence={checklist.cvcLoss.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.cvcLoss.occurred}
                      onChange={(e) => updateChecklistField('cvcLoss', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu perda de CVC</span>
                  </label>
                  
                  {checklist.cvcLoss.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries({
                          fixationDisplaced: 'Fixação deslocada',
                          manipulation: 'Manipulação/procedimento',
                          agitation: 'Agitação',
                          obstruction: 'Obstrução',
                          traction: 'Tração'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.cvcLoss.causes[key as keyof typeof checklist.cvcLoss.causes]}
                              onChange={(e) => updateNestedField('cvcLoss', 'causes', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.cvcLoss.date || ''}
                          onChange={(e) => updateChecklistField('cvcLoss', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.cvcLoss.observations || ''}
                          onChange={(e) => updateChecklistField('cvcLoss', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Erros de Medicação */}
              <IndicatorSection
                title="Erros de Medicação"
                icon={<Pill className="w-5 h-5" />}
                sectionKey="medicationErrors"
                hasOccurrence={checklist.medicationErrors.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.medicationErrors.occurred}
                      onChange={(e) => updateChecklistField('medicationErrors', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu erro de medicação</span>
                  </label>
                  
                  {checklist.medicationErrors.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries({
                          wrongPatient: 'Paciente errado',
                          wrongDrug: 'Droga errada',
                          wrongDose: 'Dose errada',
                          wrongRoute: 'Via errada',
                          wrongDilution: 'Diluição incorreta',
                          wrongTime: 'Horário errado',
                          allergyIgnored: 'Alergia ignorada'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.medicationErrors.types[key as keyof typeof checklist.medicationErrors.types]}
                              onChange={(e) => updateNestedField('medicationErrors', 'types', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.medicationErrors.date || ''}
                          onChange={(e) => updateChecklistField('medicationErrors', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.medicationErrors.observations || ''}
                          onChange={(e) => updateChecklistField('medicationErrors', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Quase-falhas de Medicação */}
              <IndicatorSection
                title="Quase-falhas de Medicação"
                icon={<CheckCircle className="w-5 h-5" />}
                sectionKey="nearMisses"
                hasOccurrence={checklist.nearMisses.occurred}
              >
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checklist.nearMisses.occurred}
                      onChange={(e) => updateChecklistField('nearMisses', 'occurred', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Ocorreu quase-falha (evento evitado)</span>
                  </label>
                  
                  {checklist.nearMisses.occurred && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries({
                          wrongPatient: 'Paciente errado',
                          wrongDrug: 'Droga errada',
                          wrongDose: 'Dose errada',
                          wrongRoute: 'Via errada',
                          wrongDilution: 'Diluição incorreta',
                          wrongTime: 'Horário errado',
                          allergyIgnored: 'Alergia ignorada'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={checklist.nearMisses.types[key as keyof typeof checklist.nearMisses.types]}
                              onChange={(e) => updateNestedField('nearMisses', 'types', key, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checklist.nearMisses.date || ''}
                          onChange={(e) => updateChecklistField('nearMisses', 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Observações"
                          value={checklist.nearMisses.observations || ''}
                          onChange={(e) => updateChecklistField('nearMisses', 'observations', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </IndicatorSection>

              {/* Rodapé */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações Gerais
                    </label>
                    <textarea
                      value={checklist.observations}
                      onChange={(e) => setChecklist(prev => ({ ...prev, observations: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Observações adicionais sobre os indicadores..."
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={saveIndicators}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Indicadores
                    </button>
                    <button
                      onClick={generatePDF}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
                    >
                      <FileDown className="w-5 h-5 mr-2" />
                      Gerar PDF Resumo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;