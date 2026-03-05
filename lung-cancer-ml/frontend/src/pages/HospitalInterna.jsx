import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, AlertTriangle, Search, Plus, FileText, Calendar, ArrowLeft, Building2 } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function HospitalInterna() {
  const navigate = useNavigate();

  // Mock do nome do hospital atual (futuramente vira do Banco de Dados)
  const hospitalAtual = "Hospital São Lucas";

  // Dados falsos (Mock) dos pacientes
  const pacientes = [
    {
      id: 'PRN-2026-001',
      nome: 'Ana Maria Santos da Silva',
      ultimaAtualizacao: '12/02/2026',
      dataNascimento: '10/04/1976'
    },
    {
      id: 'PRN-2026-002',
      nome: 'Henrique Gonçalves Ramos',
      ultimaAtualizacao: '12/02/2026',
      dataNascimento: '10/04/1976'
    }
  ];

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/painel-medico')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Hospitais
      </button>

      {/* Título da Página e INDICADOR DO HOSPITAL */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Painel Administrativo Hospitalar</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visão geral do sistema Lung Cancer Prediction</p>
        </div>
        
        {/* NOVO: Indicador Visual do Hospital */}
        <div className="bg-[#0b2b3f] text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-4 border-l-4 border-[#6eb1be]">
          <Building2 size={24} className="text-[#6eb1be]" />
          <div>
            <p className="text-xs text-[#6eb1be] font-bold uppercase tracking-wider">Hospital Atual</p>
            <p className="text-lg font-bold">{hospitalAtual}</p>
          </div>
        </div>
      </div>

      {/* Grid de Cards Estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Pacientes</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">120</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Avaliações Este Mês</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">50</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 flex items-center gap-6">
          <div className="bg-red-50 p-4 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-bold text-sm">Pacientes Alto Risco</p>
            <h3 className="text-3xl font-bold text-red-500">12</h3>
          </div>
        </div>
      </div>

      {/* Área Principal Branca */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="mb-6">
          <button className="bg-[#6eb1be] text-white px-6 py-2 rounded-full font-bold text-sm">
            Pacientes
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
              placeholder="Buscar por nome do paciente ou Id do paciente..."
            />
          </div>
          <button 
            onClick={() => navigate('/formulario-predicao')} 
            className="flex items-center justify-center gap-2 bg-[#0b2b3f] hover:bg-[#0b2b3f]/90 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg"
          >
            <Plus size={20} /> Novo predições
          </button>
        </div>

        <div className="space-y-4">
          {pacientes.map((paciente, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between p-5 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="bg-[#f4f9fb] p-3 rounded-xl text-[#0b2b3f] mt-1">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="text-[#0b2b3f] text-lg font-bold mb-2">{paciente.nome}</h4>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><FileText size={16} /> {paciente.id}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> Última atualização: {paciente.ultimaAtualizacao}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={16} /> Data de nascimento: {paciente.dataNascimento}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/perfil-paciente')}
                className="w-full md:w-auto px-6 py-2 border-2 border-[#0b2b3f] text-[#0b2b3f] font-bold rounded-lg hover:bg-[#0b2b3f] hover:text-white transition-colors"
              >
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}