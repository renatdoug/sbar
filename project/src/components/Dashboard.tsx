import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  RefreshCw,
  Timer,
  Eye,
  Edit
} from 'lucide-react';
import { Patient, Task } from '../types';
import { mockPatients, mockTasks } from '../utils/data';
import PatientDetail from './PatientDetail';
import PatientForm from './PatientForm';

interface DashboardProps {
  onNewSBAR: (patientId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewSBAR }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getDecubitusStatus = (minutes: number) => {
    if (minutes >= 120) return { color: 'bg-red-500', text: 'Crítico' };
    if (minutes >= 90) return { color: 'bg-yellow-500', text: 'Atenção' };
    return { color: 'bg-green-500', text: 'Normal' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'recovering': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const addNewTask = (patientId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      patientId,
      title: 'Nova Tarefa',
      description: 'Descrição da tarefa',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Enfermeiro João',
      dueTime: '17:00',
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const resetDecubitusTimer = (patientId: string) => {
    setPatients(patients.map(patient => 
      patient.id === patientId 
        ? { ...patient, decubitusTimer: 0, lastTurn: new Date().toISOString() }
        : patient
    ));
  };

  const openPatientDetail = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const closePatientDetail = () => {
    setSelectedPatientId(null);
  };

  const openPatientForm = (patientId?: string) => {
    if (patientId) {
      setEditingPatientId(patientId);
    } else {
      setShowNewPatientForm(true);
    }
  };

  const closePatientForm = () => {
    setEditingPatientId(null);
    setShowNewPatientForm(false);
  };

  const savePatient = (patientData: any) => {
    if (editingPatientId) {
      // Atualizar paciente existente
      setPatients(patients.map(p => p.id === editingPatientId ? patientData : p));
    } else {
      // Adicionar novo paciente
      setPatients([...patients, patientData]);
    }
    closePatientForm();
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard - Leitos UTI</h1>
          <button
            onClick={() => openPatientForm()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Paciente
          </button>
        </div>
        <p className="text-gray-600">Turno da Tarde - {currentTime.toLocaleTimeString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map(patient => {
          const patientTasks = tasks.filter(task => task.patientId === patient.id);
          const decubitusStatus = getDecubitusStatus(patient.decubitusTimer);

          return (
            <div key={patient.id} className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Leito {patient.bedNumber}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {patient.name}, {patient.age} anos
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status === 'critical' ? 'Crítico' : 
                     patient.status === 'stable' ? 'Estável' : 'Recuperando'}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <p className="text-sm text-gray-600">{patient.diagnosis}</p>
                  <p className="text-xs text-gray-500">
                    Internado em {new Date(patient.admissionDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cronômetro de Decúbito</span>
                    <span className={`w-3 h-3 rounded-full ${decubitusStatus.color}`}></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">{patient.decubitusTimer} min</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => resetDecubitusTimer(patient.id)}
                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        title="Resetar cronômetro"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNewSBAR(patient.id)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Registrar SBAR"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openPatientDetail(patient.id)}
                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        title="Ver detalhes do paciente"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openPatientForm(patient.id)}
                        className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        title="Editar dados do paciente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {decubitusStatus.text} - Última mudança: {new Date(patient.lastTurn).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Tarefas</h4>
                  <button
                    onClick={() => addNewTask(patient.id)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    title="Nova tarefa"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {patientTasks.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma tarefa pendente</p>
                  ) : (
                    patientTasks.map(task => (
                      <div key={task.id} className={`p-3 border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 rounded-r-lg`}>
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800 text-sm">{task.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                            {task.status === 'pending' ? 'Pendente' : 
                             task.status === 'in-progress' ? 'Em Andamento' : 'Concluída'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Timer className="w-3 h-3 mr-1" />
                            {task.dueTime}
                          </span>
                          <div className="flex space-x-1">
                            {task.status === 'pending' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'in-progress')}
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                              >
                                Iniciar
                              </button>
                            )}
                            {task.status === 'in-progress' && (
                              <button
                                onClick={() => updateTaskStatus(task.id, 'completed')}
                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                              >
                                Concluir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      
      {selectedPatientId && (
        <PatientDetail
          patientId={selectedPatientId}
          onClose={closePatientDetail}
        />
      )}
      
      {(editingPatientId || showNewPatientForm) && (
        <PatientForm
          patient={editingPatientId ? patients.find(p => p.id === editingPatientId) as any : undefined}
          onSave={savePatient}
          onClose={closePatientForm}
        />
      )}
    </>
  );
};

export default Dashboard;