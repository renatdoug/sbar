import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { ScaleEntry } from '../types';
import { mockScaleEntries } from '../utils/data';

const ImportScale: React.FC = () => {
  const [scaleEntries, setScaleEntries] = useState<ScaleEntry[]>(mockScaleEntries);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<{
    valid: number;
    invalid: number;
    errors: string[];
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    setUploadedFile(file);
    
    // Simulação de validação
    const mockValidation = {
      valid: Math.floor(Math.random() * 50) + 10,
      invalid: Math.floor(Math.random() * 5),
      errors: [
        'Linha 15: Técnico não cadastrado',
        'Linha 23: Data em formato inválido',
        'Linha 31: Leito não existe'
      ]
    };
    
    setValidationResults(mockValidation);
    
    // Simular adição de novos registros
    const newEntries: ScaleEntry[] = [
      {
        id: Date.now().toString(),
        technician: 'Pedro Silva',
        patient: 'José Santos',
        date: '2024-01-21',
        shift: 'morning',
        bedNumber: '107',
        validated: true
      },
      {
        id: (Date.now() + 1).toString(),
        technician: 'Ana Costa',
        patient: 'Maria Lima',
        date: '2024-01-21',
        shift: 'afternoon',
        bedNumber: '108',
        validated: false
      }
    ];
    
    setScaleEntries([...newEntries, ...scaleEntries]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const validateEntry = (entryId: string) => {
    setScaleEntries(entries =>
      entries.map(entry =>
        entry.id === entryId ? { ...entry, validated: true } : entry
      )
    );
  };

  const removeEntry = (entryId: string) => {
    setScaleEntries(entries => entries.filter(entry => entry.id !== entryId));
  };

  const getStatusColor = (validated: boolean) => {
    return validated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const downloadTemplate = () => {
    const template = `Técnico,Paciente,Data,Turno,Leito
João Silva,Maria Santos,2024-01-21,morning,101
Ana Costa,Pedro Lima,2024-01-21,afternoon,102`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_escala.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Importação de Escalas</h1>
        <p className="text-gray-600">Carregue e valide as escalas de trabalho da equipe de enfermagem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de Upload */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upload de Arquivo</h2>
              <button
                onClick={downloadTemplate}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Template
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                Arraste e solte seu arquivo CSV aqui
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ou clique para selecionar um arquivo
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2" />
                Selecionar Arquivo
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploadedFile.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resultados da Validação */}
          {validationResults && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultados da Validação</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Registros Válidos</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {validationResults.valid}
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Registros Inválidos</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {validationResults.invalid}
                  </p>
                </div>
              </div>

              {validationResults.errors.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Erros Encontrados</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {validationResults.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tabela de Registros */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Registros Carregados</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Técnico
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turno
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leito
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scaleEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.technician}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.patient}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {entry.shift === 'morning' ? 'Manhã' : 
                         entry.shift === 'afternoon' ? 'Tarde' : 'Noite'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.bedNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.validated)}`}>
                          {entry.validated ? 'Validado' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          {!entry.validated && (
                            <button
                              onClick={() => validateEntry(entry.id)}
                              className="text-green-600 hover:text-green-700"
                              title="Validar registro"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Remover registro"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar com Informações */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Formato do Arquivo</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Colunas obrigatórias:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Técnico</li>
                <li>Paciente</li>
                <li>Data (YYYY-MM-DD)</li>
                <li>Turno (morning/afternoon/night)</li>
                <li>Leito</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Validações Automáticas</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Formato de data válido</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Técnico cadastrado</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Leito existente</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Turno válido</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Dicas</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use o template fornecido</li>
              <li>• Verifique o formato das datas</li>
              <li>• Certifique-se de que os técnicos estão cadastrados</li>
              <li>• Valide os registros antes de finalizar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportScale;