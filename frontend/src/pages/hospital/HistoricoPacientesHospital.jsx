import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, FileText, Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function HistoricoPacientesHospital() {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        // CORREÇÃO: Usando a rota exclusiva do painel do hospital
        const response = await api.get('/hospital/pacientes');
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPacientes();
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    const nomeBusca = p.nome_completo || p.nome || '';
    return nomeBusca.toLowerCase().includes(termoBusca.toLowerCase()) || p.id?.toString().includes(termoBusca);
  });

  return (
    <DashboardLayout>
      <button 
        onClick={() => navigate('/painel-hospital')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Predições</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Gerencie as predições dos pacientes do hospital</p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] shadow-sm transition-all"
          placeholder="Buscar por nome do paciente ou ID do paciente..."
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center text-[#6eb1be]">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        ) : pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((paciente) => (
            <div key={paciente.id} className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              
              <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                <div className="bg-[#f4f9fb] p-3 rounded-full text-[#0b2b3f] flex-shrink-0">
                  <Activity size={24} />
                </div>
                
                <div>
                  {/* Renderização espelhada da visão do médico */}
                  <h4 className="text-[#0b2b3f] text-lg font-bold mb-1">{paciente.nome_completo || paciente.nome}</h4>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><FileText size={16} /> ID: {paciente.id}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} /> 
                      Nascimento: {paciente.data_nascimento || paciente.dataNascimento ? new Date(paciente.data_nascimento || paciente.dataNascimento).toLocaleDateString('pt-BR') : '--'}
                    </span>
                    {paciente.data_cadastro && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={16} /> 
                        Cadastrado em: {paciente.data_cadastro}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/perfil-paciente-hospital', { state: { id: paciente.id } })} 
                className="w-full md:w-auto px-8 py-2.5 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold rounded-xl hover:bg-[#6eb1be] hover:text-white transition-colors flex-shrink-0"
              >
                Ver Detalhes
              </button>
              
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">Nenhum paciente encontrado.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}