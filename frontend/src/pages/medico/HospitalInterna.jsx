import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useHospital } from "../../hooks/useHospital";
import { Search, Activity, AlertTriangle, Clock, Plus, User, FileText, Calendar, RefreshCw, AlertCircle, ArrowLeft, ClipboardList } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function HospitalInterna() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  
  const id = location.state?.hospital?.id || urlId;

  const { 
    hospitalData, 
    pacientes, 
    loading, 
    error, 
    filtro, 
    setFiltro, 
    refetch 
  } = useHospital(id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-[#6eb1be]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <button onClick={refetch} className="text-sm underline font-bold">Tentar novamente</button>
        </div>
      </DashboardLayout>
    );
  }

  // Prepara os dados do hospital para enviar na navegação
  const hospitalInfo = { 
    id: id, 
    nome: hospitalData?.nome || hospitalData?.nome_fantasia 
  };

  return (
    <DashboardLayout>
      <button 
        onClick={() => navigate('/painel-medico')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
      </button>

      {/* Cabeçalho da Página */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">
          {hospitalInfo.nome || 'Painel Administrativo Hospitalar'}
        </h2>
        <p className="text-[#6eb1be] text-lg font-medium">
          Visão geral do sistema HELENA
        </p>
      </div>

      {/* Cards de Estatísticas DINÂMICOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-5 rounded-full text-[#0b2b3f]">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm mb-1">Total de Pacientes</p>
            {/* Fallback inteligente: se o backend não mandar o total, usamos o tamanho da lista */}
            <h3 className="text-4xl font-bold text-[#0b2b3f]">{hospitalData?.total_pacientes || pacientes.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-5 rounded-full text-[#0b2b3f]">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm mb-1">Avaliações Este Mês</p>
            <h3 className="text-4xl font-bold text-[#0b2b3f]">{hospitalData?.avaliacoes_mes || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="bg-red-50 p-5 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm mb-1">Pacientes Alto Risco</p>
            <h3 className="text-4xl font-bold text-[#0b2b3f]">{hospitalData?.alto_risco || 0}</h3>
          </div>
        </div>
      </div>

      {/* Container Principal da Lista */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        
        {/* Barra Superior da Lista */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          
          {/* BOTÃO CORRIGIDO AQUI: Agora ele navega para HistoricoPredicoes */}
          <button 
            onClick={() => navigate('/historico-predicoes', { state: { hospital: hospitalInfo } })}
            className="bg-[#6eb1be] hover:bg-[#5ca0ad] text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-md shrink-0 transition-colors"
          >
            <ClipboardList size={20} />
            <span>Predições</span>
          </button>
          
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome do paciente ou Id do paciente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
            />
          </div>

          <button 
            onClick={() => navigate('/formulario-predicao', { state: { hospital: hospitalInfo } })}
            className="bg-[#0b2b3f] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#0b2b3f]/90 transition-colors shrink-0"
          >
            <Plus size={20} />
            Nova predição
          </button>
        </div>

        {/* Lista de Cartões de Pacientes */}
        <div className="space-y-4">
          {pacientes.length > 0 ? (
            pacientes.map((paciente) => (
              <div key={paciente.id} className="border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="bg-[#f4f9fb] p-4 rounded-full text-[#0b2b3f] shrink-0">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0b2b3f] mb-2">{paciente.nome_completo || paciente.nome}</h4>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>ID: {paciente.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Última atualização: {paciente.ultimaAtualizacao || paciente.ultima_atualizacao || 'Recente'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Data de nascimento: {paciente.dataNascimento || paciente.data_nascimento || 'Não informada'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 shrink-0">
                  <button 
                    onClick={() => navigate(`/perfil-paciente/${paciente.id}`)}
                    className="px-6 py-2 border border-[#0b2b3f] text-[#0b2b3f] font-bold text-sm rounded-full hover:bg-[#0b2b3f] hover:text-white transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 font-medium border border-gray-100 rounded-2xl">
              Nenhum paciente encontrado. Realize uma nova predição.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}