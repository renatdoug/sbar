import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SBARForm from './components/SBARForm';
import Indicators from './components/Indicators';
import ImportScale from './components/ImportScale';
import PatientList from './components/PatientList';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientForSBAR, setSelectedPatientForSBAR] = useState<string | undefined>();

  const handleNewSBAR = (patientId: string) => {
    setSelectedPatientForSBAR(patientId);
    setActiveTab('sbar');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNewSBAR={handleNewSBAR} />;
      case 'patients':
        return <PatientList />;
      case 'sbar':
        return <SBARForm selectedPatientId={selectedPatientForSBAR} />;
      case 'indicators':
        return <Indicators />;
      case 'import':
        return <ImportScale />;
      default:
        return <Dashboard onNewSBAR={handleNewSBAR} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;