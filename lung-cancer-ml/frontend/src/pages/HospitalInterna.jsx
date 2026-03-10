import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Clock, AlertTriangle, Search, Plus, FileText, Calendar, ArrowLeft, Building2, Users } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

export default function HospitalInterna() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const hospital = location.state?.hospital;

  const [pacientes, setPacientes] = useState([]);
  
  // Estado para os cards estatísticos deste hospital
  const [statsHospital, setStatsHospital] = useState({
    avaliacoes_mes: 0,
    pacientes_risco: 0
  });

  useEffect(() => {
    if (!hospital) {
      navigate('/painel-medico');
      return;
    }

    const buscarPacientes = async () => {
      try {
        const response = await api.get(`/hospitais/${hospital.id}/pacientes`);
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    const buscarEstatisticas = async () => {
      try {
        const response = await api.get(`/dashboard/hospital/${hospital.id}`);
        setStatsHospital(response.data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas do hospital:", error);
      }
    };

    buscarPacientes();
    buscarEstatisticas();
  }, [hospital, navigate]);

  // LÓGICA DE FILTRO: Ordena os pacientes do mais recente para o mais antigo e corta os 3 primeiros
  const pacientesRecentes = [...pacientes]
    .sort((a, b) => new Date(b.ultimaAtualizacao || 0) - new Date(a.ultimaAtualizacao || 0))
    .slice(0, 3);

  if (!hospital) return null; 

  return (
    <DashboardLayout>
      
      <button 
        onClick={() => navigate('/painel-medico')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={18} /> Voltar para o painel
      </button>

      {/* CABEÇALHO DO HOSPITAL */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-[#f4f9fb] p-4 rounded-xl text-[#0b2b3f]">
            <Building2 size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#0b2b3f] mb-2">{hospital.nome}</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                {hospital.status || "Ativo"}
              </span>
              <span className="text-gray-500 font-medium text-sm pt-1">ID do Hospital: {hospital.id}</span>
            </div>
          </div>
        </div>

        {/* GRUPO DE BOTÕES */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/historico-predicoes', { state: { hospital } })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-[#6eb1be] text-[#6eb1be] hover:bg-[#f4f9fb] px-6 py-3.5 rounded-xl font-bold transition-all"
          >
            <Users size={20} /> Pacientes
          </button>

          <button 
            onClick={() => navigate('/formulario-predicao', { state: { hospital } })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#6eb1be]/30"
          >
            <Plus size={20} /> Fazer nova avaliação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Activity size={24} /></div>
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase">Pacientes Registrados</p>
            <h4 className="text-2xl font-bold text-[#0b2b3f]">{pacientes.length}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-lg text-green-600"><Clock size={24} /></div>
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase">Avaliações no Mês</p>
            <h4 className="text-2xl font-bold text-[#0b2b3f]">{statsHospital.avaliacoes_mes}</h4> 
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-lg text-red-600"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase">Pacientes de Alto Risco</p>
            <h4 className="text-2xl font-bold text-[#0b2b3f]">{statsHospital.pacientes_risco}</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0b2b3f]">Pacientes Recentes</h3>
            <p className="text-gray-500 font-medium text-sm">Últimos perfis atualizados neste hospital</p>
          </div>
          
          {/* Botão de atalho rápido para ver todos */}
          <button 
            onClick={() => navigate('/historico-predicoes', { state: { hospital } })}
            className="text-[#6eb1be] font-bold text-sm hover:text-[#0b2b3f] transition-colors"
          >
            Ver todos os pacientes →
          </button>
        </div>

        <div className="space-y-4">
          {pacientesRecentes.length > 0 ? (
            pacientesRecentes.map((paciente) => (
              <div key={paciente.id} className="flex flex-col md:flex-row items-center justify-between p-5 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
                
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className="bg-[#f4f9fb] p-3 rounded-xl text-[#0b2b3f] mt-1">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-[#0b2b3f] text-lg font-bold mb-2">{paciente.nome}</h4>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><FileText size={16} /> ID: {paciente.id}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} /> 
                        Última atualização: {paciente.ultimaAtualizacao ? new Date(paciente.ultimaAtualizacao).toLocaleDateString('pt-BR') : '--'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={16} /> 
                        Data Nasc: {paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR') : '--'}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/perfil-paciente', { state: { paciente } })}
                  className="w-full md:w-auto px-6 py-2 border-2 border-[#0b2b3f] text-[#0b2b3f] font-bold rounded-lg hover:bg-[#0b2b3f] hover:text-white transition-colors"
                >
                  Ver Perfil
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 font-medium">Nenhum paciente cadastrado para você neste hospital ainda.</p>
            </div>
          )}
        </div>
      </div>

    </DashboardLayout>
  );
}