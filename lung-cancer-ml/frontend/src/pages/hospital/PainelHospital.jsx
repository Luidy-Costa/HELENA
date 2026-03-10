import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Clock, AlertTriangle, Search, UserPlus } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function PainelHospital() {
  const navigate = useNavigate();
  
  // Controle de qual aba está ativa (Médicos ou Pacientes)
  const [abaAtiva, setAbaAtiva] = useState('medicos');

  // Dados falsos (Mock) dos médicos vinculados ao hospital
  const medicos = [
    { id: 1, nome: 'Dr. João Silva', crm: '15624-SP', pacientes: 60, avaliacoes: 25, status: 'ativo' },
    { id: 2, nome: 'Dra. Paula Sousa', crm: '16345-SP', pacientes: 60, avaliacoes: 25, status: 'ativo' },
  ];

  return (
    <DashboardLayout>
      
      {/* Cabeçalho da Página */}
      <div className="mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Painel Administrativo Hospitalar</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visão geral do sistema Lung Cancer Prediction</p>
      </div>

      {/* Grid de Cards Estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card 1: Médicos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-full text-[#0b2b3f]">
            <Users size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Médicos Ativos</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">2</h3>
          </div>
        </div>

        {/* Card 2: Pacientes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-full text-[#0b2b3f]">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Pacientes</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">120</h3>
          </div>
        </div>

        {/* Card 3: Avaliações */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-full text-[#0b2b3f]">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Avaliações Este Mês</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">50</h3>
          </div>
        </div>

        {/* Card 4: Alto Risco (Vermelho) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 flex items-center gap-6">
          <div className="bg-red-50 p-4 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-bold text-sm">Pacientes Alto Risco</p>
            <h3 className="text-3xl font-bold text-red-500">12</h3>
          </div>
        </div>
      </div>

      {/* Área Principal Branca (Tabela e Controles) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        
        {/* Controles Superiores: Abas e Botão Adicionar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          {/* Abas */}
          <div className="flex bg-[#f4f9fb] rounded-full p-1 border border-gray-100">
            <button 
              onClick={() => setAbaAtiva('medicos')}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all ${
                abaAtiva === 'medicos' 
                  ? 'bg-[#0b2b3f] text-white shadow-md' 
                  : 'text-[#6eb1be] hover:bg-white/50'
              }`}
            >
              <Users size={18} /> Médicos
            </button>
            <button 
              onClick={() => setAbaAtiva('pacientes')}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all ${
                abaAtiva === 'pacientes' 
                  ? 'bg-[#6eb1be] text-white shadow-md' 
                  : 'text-[#6eb1be] hover:bg-white/50'
              }`}
            >
              <Activity size={18} /> Pacientes
            </button>
          </div>

          {/* Botão Adicionar Médico */}
          <button 
            onClick={() => navigate('/convidar-medico')}
            className="flex items-center gap-2 bg-[#0b2b3f] hover:bg-[#0b2b3f]/90 text-white px-6 py-3 rounded-full font-bold transition-colors shadow-lg"
          >
            <UserPlus size={20} /> Adicionar Médico
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
            placeholder="Buscar por nome, CRM ou especialidade..."
          />
        </div>

        {/* Tabela de Médicos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 font-bold text-[#0b2b3f]">Médico</th>
                <th className="py-4 px-4 font-bold text-[#0b2b3f]">CRM</th>
                <th className="py-4 px-4 font-bold text-[#0b2b3f]">Pacientes</th>
                <th className="py-4 px-4 font-bold text-[#0b2b3f]">Avaliações</th>
                <th className="py-4 px-4 font-bold text-[#0b2b3f]">Status</th>
                <th className="py-4 px-4 font-bold text-[#0b2b3f]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f4f9fb] p-2 rounded-full text-[#0b2b3f]">
                        <Users size={20} />
                      </div>
                      <span className="font-bold text-[#0b2b3f]">{medico.nome}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-gray-500 font-medium">{medico.crm}</td>
                  <td className="py-5 px-4 text-[#6eb1be] font-bold">{medico.pacientes}</td>
                  <td className="py-5 px-4 text-gray-500 font-medium">{medico.avaliacoes}</td>
                  <td className="py-5 px-4">
                    <span className="px-4 py-1.5 border border-green-400 text-green-600 text-xs font-bold uppercase rounded-full bg-green-50">
                      {medico.status}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <button 
                      onClick={() => navigate('/admin-perfil-medico')}
                      className="px-6 py-2 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold text-sm rounded-lg hover:bg-[#6eb1be] hover:text-white transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
}