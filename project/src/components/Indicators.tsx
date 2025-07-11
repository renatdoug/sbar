import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  Filter,
  Download,
  PieChart
} from 'lucide-react';
import { Indicator } from '../types';
import { mockIndicators } from '../utils/data';

const Indicators: React.FC = () => {
  const [indicators] = useState<Indicator[]>(mockIndicators);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');

  const filteredIndicators = indicators.filter(indicator => {
    if (selectedType !== 'all' && indicator.type !== selectedType) return false;
    if (selectedShift !== 'all' && indicator.shift !== selectedShift) return false;
    return true;
  });

  const getLPPData = () => {
    const lppIndicators = filteredIndicators.filter(i => i.type === 'lpp');
    const locationCount = lppIndicators.reduce((acc, indicator) => {
      const location = indicator.location || 'Não especificado';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCount).map(([location, count]) => ({
      location,
      count,
      percentage: (count / lppIndicators.length) * 100
    }));
  };

  const getFallsData = () => {
    const fallsIndicators = filteredIndicators.filter(i => i.type === 'falls');
    const typeCount = fallsIndicators.reduce((acc, indicator) => {
      const type = indicator.fallType || 'Não especificado';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: (count / fallsIndicators.length) * 100
    }));
  };

  const getIndicatorCounts = () => {
    return {
      lpp: filteredIndicators.filter(i => i.type === 'lpp').length,
      falls: filteredIndicators.filter(i => i.type === 'falls').length,
      extubation: filteredIndicators.filter(i => i.type === 'extubation').length,
      medication: filteredIndicators.filter(i => i.type === 'medication').length,
    };
  };

  const lppData = getLPPData();
  const fallsData = getFallsData();
  const counts = getIndicatorCounts();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Indicadores de Qualidade</h1>
        <p className="text-gray-600">Monitoramento de eventos adversos e indicadores de segurança</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="quarter">Último trimestre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="lpp">LPP</option>
              <option value="falls">Quedas</option>
              <option value="extubation">Extubação</option>
              <option value="medication">Medicação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="morning">Manhã</option>
              <option value="afternoon">Tarde</option>
              <option value="night">Noite</option>
            </select>
          </div>

          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">LPP</p>
              <p className="text-2xl font-bold text-red-600">{counts.lpp}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Lesões por Pressão</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quedas</p>
              <p className="text-2xl font-bold text-orange-600">{counts.falls}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Eventos de Queda</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Extubações</p>
              <p className="text-2xl font-bold text-blue-600">{counts.extubation}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Não programadas</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medicação</p>
              <p className="text-2xl font-bold text-green-600">{counts.medication}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Erros e Quase-falhas</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de LPP por Localização */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">LPP por Localização</h3>
          <div className="space-y-3">
            {lppData.map(item => (
              <div key={item.location} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{item.location}</span>
                  <span className="text-sm font-medium text-gray-800">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {lppData.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum dado de LPP no período selecionado
              </p>
            )}
          </div>
        </div>

        {/* Gráfico de Quedas por Tipo */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quedas por Tipo</h3>
          <div className="space-y-3">
            {fallsData.map(item => (
              <div key={item.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                  <span className="text-sm font-medium text-gray-800">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {fallsData.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum dado de quedas no período selecionado
              </p>
            )}
          </div>
        </div>

        {/* Tendência dos Indicadores */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendência dos Indicadores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Distribuição por Turno</h4>
              <div className="space-y-2">
                {['morning', 'afternoon', 'night'].map(shift => {
                  const shiftCount = indicators.filter(i => i.shift === shift).length;
                  const percentage = (shiftCount / indicators.length) * 100;
                  return (
                    <div key={shift} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">
                        {shift === 'morning' ? 'Manhã' : 
                         shift === 'afternoon' ? 'Tarde' : 'Noite'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{shiftCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Eventos Recentes</h4>
              <div className="space-y-2">
                {indicators.slice(0, 3).map(indicator => (
                  <div key={indicator.id} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {indicator.type === 'lpp' ? 'LPP' :
                         indicator.type === 'falls' ? 'Queda' :
                         indicator.type === 'extubation' ? 'Extubação' : 'Medicação'}
                      </span>
                      <span className="text-xs text-gray-500">{indicator.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{indicator.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indicators;