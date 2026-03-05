import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, FileText, Calendar, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function HistoricoPredicoes() {
  const navigate = useNavigate();

  // Dados falsos (Mock) expandidos baseados na sua nova imagem
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
      dataNascimento: '03/11/1960'
    },
    {
      id: 'PRN-2026-003',
      nome: 'Lorena Martins de Sousa',
      ultimaAtualizacao: '11/02/2026',
      dataNascimento: '09/07/2001'
    },
    {
      id: 'PRN-2026-004',
      nome: 'Antônio Luís da Silva',
      ultimaAtualizacao: '11/02/2026',
      dataNascimento: '05/01/1989'
    }
  ];

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar (Opcional, mas ajuda na navegação) */}
      <button 
        onClick={() => navigate('/hospital-interna')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
      </button>

      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Predições</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Gerencie as predições dos seus pacientes</p>
      </div>

      {/* Barra de Pesquisa Larga */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] shadow-sm transition-all"
          placeholder="Buscar por nome do paciente ou Id do paciente..."
        />
      </div>

      {/* Lista Completa de Pacientes (Cards estilo "Pill" largo) */}
      <div className="space-y-4">
        {pacientes.map((paciente, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
            
            {/* Informações à Esquerda */}
            <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
              {/* Ícone Redondinho */}
              <div className="bg-[#f4f9fb] p-3 rounded-full text-[#0b2b3f] flex-shrink-0">
                <Activity size={24} />
              </div>
              
              {/* Textos */}
              <div>
                <h4 className="text-[#0b2b3f] text-lg font-bold mb-1">{paciente.nome}</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><FileText size={16} /> {paciente.id}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> Última atualização: {paciente.ultimaAtualizacao}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> Data de nascimento: {paciente.dataNascimento}</span>
                </div>
              </div>
            </div>

            {/* Botão Ver Detalhes */}
            <button 
              onClick={() => navigate('/perfil-paciente')} 
              className="w-full md:w-auto px-6 py-2 border-2 border-[#0b2b3f] text-[#0b2b3f] font-bold rounded-lg hover:bg-[#0b2b3f] hover:text-white transition-colors flex-shrink-0"
            >
              Ver Detalhes
            </button>
            
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}