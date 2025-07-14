// src/pages/Pacientes.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';

interface Paciente {
  id: number;
  nome: string;
  prontuario: string;
  leito: string;
  idade: number;
  // adicione outros campos conforme seu modelo
}

const Pacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const data = await fetchData('pacientes/');
        setPacientes(data);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarPacientes();
  }, []);

  if (loading) return <p>Carregando pacientes...</p>;

  return (
    <div>
      <h1>Lista de Pacientes</h1>
      <ul>
        {pacientes.map((paciente) => (
          <li key={paciente.id}>
            {paciente.nome} - Leito: {paciente.leito} - Idade: {paciente.idade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pacientes;
