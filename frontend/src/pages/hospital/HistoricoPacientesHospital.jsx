import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, FileText, Calendar, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function HistoricoPacientesHospital() {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');

  // Dados falsos (Mock) baseados no seu design
  const pacientes = [
    { id: 'PRN-2026-001', nome: 'Ana Maria Santos da Silva', atualizacao: '12/02/2026', nascimento: '10/04/1976' },
    { id: 'PRN-2026-002', nome: 'Henrique Gonçalves Ramos', atualizacao: '12/02/2026', nascimento: '03/11/1960' },
    { id: 'PRN-2026-003', nome: 'Lorena Martins de Sousa', atualizacao: '11/02/2026', nascimento: '09/07/2001' },
    { id: 'PRN-2026-004', nome: 'Antônio Luís da Silva', atualizacao: '11/02/2026', nascimento: '05/01/1989' },
  ];

  // Filtro da barra de pesquisa
  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    p.id.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/painel-hospital')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
      </button>

      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Predições</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Gerencie as predições dos pacientes do hospital</p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] shadow-sm transition-all"
          placeholder="Buscar por nome do paciente ou Id do paciente..."
        />
      </div>

      {/* Lista de Pacientes (Estilo Cards Longos) */}
      <div className="space-y-4">
        {pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((paciente, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              
              {/* Informações à Esquerda */}
              <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                <div className="bg-[#f4f9fb] p-3 rounded-full text-[#0b2b3f] flex-shrink-0">
                  <Activity size={24} />
                </div>
                
                <div>
                  <h4 className="text-[#0b2b3f] text-lg font-bold mb-1">{paciente.nome}</h4>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><FileText size={16} /> {paciente.id}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} /> 
                      Última atualização: {paciente.atualizacao}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} /> 
                      Data de nascimento: {paciente.nascimento}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão Ver Detalhes */}
              <button 
                onClick={() => navigate('/perfil-paciente-hospital')} 
                className="w-full md:w-auto px-8 py-2.5 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold rounded-xl hover:bg-[#6eb1be] hover:text-white transition-colors flex-shrink-0"
              >
                Ver Detalhes
              </button>
              
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">Nenhum paciente encontrado com este nome ou ID.</p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}