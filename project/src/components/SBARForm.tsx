import React, { useState } from 'react';
import { Save, Clock, User, FileText, History } from 'lucide-react';
import { SBARRecord, Patient } from '../types';
import { mockPatients, mockSBARRecords } from '../utils/data';

interface SBARFormProps {
  selectedPatientId?: string;
}

const SBARForm: React.FC<SBARFormProps> = ({ selectedPatientId }) => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [sbarRecords, setSbarRecords] = useState<SBARRecord[]>(mockSBARRecords);
  const [selectedPatient, setSelectedPatient] = useState(selectedPatientId || '');
  const [formData, setFormData] = useState({
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newSBAR: SBARRecord = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      ...formData,
      createdAt: new Date().toISOString(),
      shift: 'afternoon',
      createdBy: 'Enfermeiro João'
    };

    setSbarRecords([newSBAR, ...sbarRecords]);
    setFormData({
      situation: '',
      background: '',
      assessment: '',
      recommendation: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.name} - Leito ${patient.bedNumber}` : 'Paciente não encontrado';
  };

  const getCurrentShiftRecords = () => {
    return sbarRecords.filter(record => record.shift === 'afternoon');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Registro SBAR</h1>
        <p className="text-gray-600">Structured Bedside Assessment and Reporting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário SBAR */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Novo Registro SBAR</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Paciente
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - Leito {patient.bedNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">S</span>
                    Situação
                  </span>
                </label>
                <textarea
                  value={formData.situation}
                  onChange={(e) => handleInputChange('situation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva a situação atual do paciente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">B</span>
                    Breve Histórico
                  </span>
                </label>
                <textarea
                  value={formData.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Histórico relevante do paciente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">A</span>
                    Avaliação
                  </span>
                </label>
                <textarea
                  value={formData.assessment}
                  onChange={(e) => handleInputChange('assessment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Avaliação atual do paciente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">R</span>
                    Recomendação
                  </span>
                </label>
                <textarea
                  value={formData.recommendation}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Recomendações e próximos passos..."
                />
              </div>

              <button
                type="submit"
                disabled={!selectedPatient}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar SBAR
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar com histórico */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <History className="w-5 h-5 mr-2" />
                Histórico do Turno
              </h3>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {getCurrentShiftRecords().map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {getPatientName(record.patientId)}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(record.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Situação:</strong> {record.situation.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      Registrado por: {record.createdBy}
                    </p>
                  </div>
                ))}
                
                {getCurrentShiftRecords().length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum registro SBAR no turno atual
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Dicas SBAR</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>S</strong>ituação: Estado atual do paciente</li>
              <li>• <strong>B</strong>ackground: Histórico relevante</li>
              <li>• <strong>A</strong>ssessment: Avaliação profissional</li>
              <li>• <strong>R</strong>ecomendação: Ações sugeridas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SBARForm;