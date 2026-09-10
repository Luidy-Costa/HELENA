import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Activity, Clock, Search } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PainelMedico() {
  const navigate = useNavigate();

  const [estatisticas, setEstatisticas] = useState({
    total_predicoes: 0,
    pacientes_atendidos: 0,
    casos_graves: 0,
    taxa_risco: "0%"
  });

  const [hospitais, setHospitais] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resStats, resHospitais] = await Promise.all([
          api.get('/dashboard/resumo'),
          api.get('/dashboard/meus-hospitais')
        ]);
        
        setEstatisticas(resStats.data);
        setHospitais(resHospitais.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('@HELENA:token');
          navigate('/login-medico');
        }
      }
    };

    carregarDados();
  }, [navigate]);

  const hospitaisFiltrados = hospitais.filter((hospital) =>
    hospital.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Cabeçalho da Página */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">
          Painel Administrativo do Médico
        </h2>
        <p className="text-[#6eb1be] text-lg font-medium">
          Visão geral do sistema Lung Cancer Prediction
        </p>
      </div>

      {/* Cards de Estatísticas (3 colunas conforme protótipo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-5 rounded-full text-[#0b2b3f]">
            <Building2 size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm mb-1">Total de Hospitais</p>
            <h3 className="text-4xl font-bold text-[#0b2b3f]">{hospitais.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-5 rounded-full text-[#0b2b3f]">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm mb-1">Total de Pacientes</p>
            <h3 className="text-4xl font-bold text-[#0b2b3f]">{estatisticas.pacientes_atendidos}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-5 rounded-full text-[#0b2b3f]">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm mb-1">Avaliações Este Mês</p>
            <h3 className="text-4xl font-bold text-[#0b2b3f]">{estatisticas.total_predicoes}</h3>
          </div>
        </div>
      </div>

      {/* Container Principal da Tabela */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#0b2b3f] mb-1">Hospitais Cadastrados</h3>
          <p className="text-gray-400 font-medium text-sm">
            Gerencie as instituições que utilizam o sistema
          </p>
        </div>

        {/* Barra de Busca */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
            placeholder="Buscar por hospital..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        {/* Tabela Limpa */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 pt-2 font-bold text-[#0b2b3f]">Hospital</th>
                <th className="pb-4 pt-2 font-bold text-[#0b2b3f]">Médicos</th>
                <th className="pb-4 pt-2 font-bold text-[#0b2b3f]">Pacientes</th>
                <th className="pb-4 pt-2 font-bold text-[#0b2b3f]">Status</th>
                <th className="pb-4 pt-2 font-bold text-[#0b2b3f] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {hospitaisFiltrados.length > 0 ? (
                hospitaisFiltrados.map((hospital) => (
                  <tr key={hospital.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#f4f9fb] p-3 rounded-full text-[#0b2b3f]">
                          <Building2 size={20} />
                        </div>
                        <span className="font-bold text-[#0b2b3f] text-base">{hospital.nome}</span>
                      </div>
                    </td>
                    <td className="py-5 text-gray-500 font-semibold">{hospital.medicos || 0}</td>
                    <td className="py-5 text-gray-500 font-semibold">{hospital.pacientes || 0}</td>
                    <td className="py-5">
                      <span className="px-4 py-1.5 font-bold text-xs rounded-full border border-green-400 text-green-500 bg-white">
                        {hospital.status?.toLowerCase() || 'ativo'}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button 
                        onClick={() => navigate('/hospital-interna', { state: { hospital } })} 
                        className="px-5 py-2 border border-[#0b2b3f] text-[#0b2b3f] font-bold text-xs rounded-full hover:bg-[#0b2b3f] hover:text-white transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
                    Nenhum hospital encontrado.
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