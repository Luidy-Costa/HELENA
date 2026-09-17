import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Activity, Clock, AlertTriangle, Search, UserPlus, ArrowLeft, FileText, Calendar, RefreshCw, ShieldAlert } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function HospitalInternaAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('medicos');
  const [termoBusca, setTermoBusca] = useState('');
  
  const [hospitalNome, setHospitalNome] = useState('Carregando Instituição...');
  const [loading, setLoading] = useState(true);

  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [stats, setStats] = useState({
    medicos_ativos: 0,
    total_pacientes: 0,
    avaliacoes_mes: 0,
    alto_risco: 0
  });

  useEffect(() => {
    const carregarDadosDoHospital = async () => {
      try {
        const resHospitais = await api.get('/admin/hospitais');
        const hospitalAtual = resHospitais.data.find(h => h.id.toString() === id.toString());
        if (hospitalAtual) setHospitalNome(hospitalAtual.nome);

        const [resStats, resMedicos, resPacientes] = await Promise.all([
          api.get(`/admin/hospital/${id}/dashboard`),
          api.get(`/admin/hospital/${id}/medicos`),
          api.get(`/admin/hospital/${id}/pacientes`)
        ]);
        
        setStats(resStats.data);
        setMedicos(resMedicos.data);
        setPacientes(resPacientes.data);
      } catch (error) {
        console.error("Erro ao carregar dados da auditoria:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoHospital();
  }, [id]);

  const medicosFiltrados = medicos.filter(m => 
    m.nome_completo?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    m.crm?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const pacientesFiltrados = pacientes.filter(p => 
    p.id_paciente?.toString().includes(termoBusca)
  );

  return (
    <DashboardLayout>
      <div className="mb-8 mt-4">
        <button 
          onClick={() => navigate('/painel-admin')}
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft size={16} /> Voltar para o Painel
        </button>
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Auditoria: {hospitalNome}</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visão restrita e anonimizada da instituição</p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-[#6eb1be]" />
        </div>
      ) : (
        <>
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
                <p className="text-[#6eb1be] font-bold text-sm">Avaliações Este Mês</p>
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              
              <div className="flex bg-[#f4f9fb] rounded-lg p-1 border border-gray-100 w-full lg:w-auto">
                <button 
                  onClick={() => { setAbaAtiva('medicos'); setTermoBusca(''); }}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md font-bold text-sm transition-all ${
                    abaAtiva === 'medicos' ? 'bg-[#0b2b3f] text-white shadow-sm' : 'text-[#6eb1be] hover:bg-white/50'
                  }`}
                >
                  <Users size={16} /> Médicos
                </button>
                <button 
                  onClick={() => { setAbaAtiva('pacientes'); setTermoBusca(''); }}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md font-bold text-sm transition-all ${
                    abaAtiva === 'pacientes' ? 'bg-[#0b2b3f] text-white shadow-sm' : 'text-[#6eb1be] hover:bg-white/50'
                  }`}
                >
                  <Activity size={16} /> Pacientes
                </button>
              </div>

              {/* Botão de Adicionar Médico Corrigido[cite: 1] */}
              <button 
                onClick={() => navigate('/admin/convidar-medico', { state: { hospital_id: id } })}
                className="flex items-center justify-center gap-2 bg-[#0b2b3f] hover:bg-[#1a425e] text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm w-full lg:w-auto"
              >
                <UserPlus size={18} /> Adicionar Médico
              </button>
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
                placeholder={abaAtiva === 'medicos' ? "Buscar por nome ou CRM..." : "Buscar paciente EXCLUSIVAMENTE por ID..."}
              />
            </div>

            {abaAtiva === 'medicos' ? (
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
                              medico.ativo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-600 border-red-200'
                            }`}>
                              {medico.ativo ? 'ativo' : 'inativo'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            {/* Botão de Ver Detalhes Corrigido[cite: 1] */}
                            <button 
                              onClick={() => navigate('/admin/perfil-medico', { state: { medico_id: medico.id, hospital_id: id } })}
                              className="px-4 py-2 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold text-sm rounded-lg hover:bg-[#6eb1be] hover:text-white transition-colors"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="py-8 text-center text-gray-500 font-medium">Nenhum médico encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <div key={paciente.id_paciente} className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                        <div className="bg-[#f4f9fb] p-3 rounded-full text-[#0b2b3f] flex-shrink-0">
                          <Activity size={24} />
                        </div>
                        <div>
                          <h4 className="text-[#0b2b3f] text-lg font-bold mb-1">PACIENTE ANÔNIMO (LGPD)</h4>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><FileText size={16} /> ID: {paciente.id_paciente}</span>
                            <span className="flex items-center gap-1.5">
                              <Calendar size={16} /> Nascimento: **/**/****
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={16} /> Última att: {new Date(paciente.ultima_atualizacao).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/admin/perfil-paciente', { state: { id: paciente.id_paciente } })}
                        className="w-full md:w-auto px-8 py-2.5 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold rounded-xl hover:bg-[#6eb1be] hover:text-white transition-colors flex-shrink-0"
                      >
                        Auditar Histórico
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-gray-100 rounded-2xl">
                    <p className="text-gray-500 font-medium">Nenhum paciente encontrado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}