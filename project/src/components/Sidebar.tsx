import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  Upload, 
  Users, 
  Heart,
  Bell,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: UserPlus, label: 'Pacientes' },
    { id: 'sbar', icon: ClipboardList, label: 'Registro SBAR' },
    { id: 'indicators', icon: BarChart3, label: 'Indicadores' },
    { id: 'import', icon: Upload, label: 'Importar Escalas' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">UTI Admin</h1>
            <p className="text-sm text-gray-600">Sistema de Enfermagem</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Turno Atual</p>
              <p className="text-xs text-blue-600">Tarde - 14:00 às 22:00</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Enfermeiro João</p>
            <p className="text-xs text-gray-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;