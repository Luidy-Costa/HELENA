import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Clock, AlertTriangle, Search, UserPlus } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PainelHospital() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('medicos');
  const [termoBusca, setTermoBusca] = useState('');
  
  const [medicos, setMedicos] = useState([]);
  const [stats, setStats] = useState({
    medicos_ativos: 0,
    total_pacientes: 0,
    avaliacoes_mes: 0,
    alto_risco: 0
  });

  useEffect(() => {
    const carregarDadosPainel = async () => {
      try {
        // Busca tabela e estatísticas simultaneamente (mais rápido)
        const [resMedicos, resStats] = await Promise.all([
          api.get('/hospital/medicos'),
          api.get('/hospital/dashboard')
        ]);
        
        // Atribuição direta e limpa!
        setMedicos(resMedicos.data);
        setStats(resStats.data);
        
      } catch (error) {
        console.error("Erro ao carregar dados do hospital:", error);
        // Se o Token expirou ou o Hospital sofreu Soft Delete:
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('@HELENA:token');
          navigate('/login-hospital');
        }
      }
    };

    carregarDadosPainel();
  }, [navigate]);

  const medicosFiltrados = medicos.filter(m => 
    m.nome_completo?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    m.crm?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Painel Administrativo Hospitalar</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visão geral do sistema HELENA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Users size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Médicos Ativos</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.medicos_ativos}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Activity size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Pacientes</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.total_pacientes}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Clock size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Avaliações do Mês</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.avaliacoes_mes}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 flex items-center gap-6">
          <div className="bg-red-50 p-4 rounded-lg text-red-500"><AlertTriangle size={32} /></div>
          <div>
            <p className="text-gray-500 font-bold text-sm">Pacientes Alto Risco</p>
            <h3 className="text-3xl font-bold text-red-500">{stats.alto_risco}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#0b2b3f]">Médicos Vinculados</h3>
            <p className="text-gray-500 font-medium text-sm">Gerencie os profissionais de saúde do seu hospital</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex bg-[#f4f9fb] rounded-lg p-1 border border-gray-100">
              <button 
                onClick={() => setAbaAtiva('medicos')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold text-sm transition-all ${
                  abaAtiva === 'medicos' ? 'bg-[#0b2b3f] text-white shadow-sm' : 'text-[#6eb1be] hover:bg-white/50'
                }`}
              >
                <Users size={16} /> Médicos
              </button>
              <button 
                onClick={() => navigate('/historico-pacientes-hospital')}
                className="flex items-center gap-2 px-6 py-2 rounded-md font-bold text-sm transition-all text-[#6eb1be] hover:bg-white/50"
              >
                <Activity size={16} /> Pacientes
              </button>
            </div>

            <button 
              onClick={() => navigate('/convidar-medico')}
              className="flex items-center justify-center gap-2 bg-[#0b2b3f] hover:bg-[#1a425e] text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm"
            >
              <UserPlus size={18} /> Adicionar
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
            placeholder="Buscar por nome ou CRM..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-[#0b2b3f]">Médico</th>
                <th className="py-4 font-bold text-[#0b2b3f]">CRM</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Status</th>
                <th className="py-4 font-bold text-[#0b2b3f] text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {medicosFiltrados.length > 0 ? (
                medicosFiltrados.map((medico) => (
                  <tr key={medico.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#f4f9fb] p-2 rounded-lg text-[#0b2b3f]">
                          <Users size={20} />
                        </div>
                        <span className="font-bold text-[#0b2b3f]">{medico.nome_completo}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium">{medico.crm}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 font-semibold text-sm rounded-full border ${
                        medico.ativo 
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-600 border-red-200'
                      }`}>
                        {medico.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => navigate('/perfil-medico-hospital', { state: { medico_id: medico.id } })}
                        className="px-4 py-2 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold text-sm rounded-lg hover:bg-[#6eb1be] hover:text-white transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">
                    Nenhum médico vinculado a este hospital ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
}