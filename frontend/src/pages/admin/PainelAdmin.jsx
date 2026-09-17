import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Activity, Clock, Search, Plus, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PainelAdmin() {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  
  const [hospitais, setHospitais] = useState([]);
  const [stats, setStats] = useState({
    total_hospitais: 0,
    total_medicos: 0,
    total_pacientes: 0,
    avaliacoes_mes: 0
  });

  useEffect(() => {
    const carregarDadosGlobais = async () => {
      try {
        const [resStats, resHospitais] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/hospitais')
        ]);
        
        setStats(resStats.data);
        setHospitais(resHospitais.data);
      } catch (error) {
        console.error("Erro ao carregar dados do administrador:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('@HELENA:token');
          navigate('/login-admin');
        }
      }
    };

    carregarDadosGlobais();
  }, [navigate]);

  const hospitaisFiltrados = hospitais.filter(h => 
    h.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    h.cnpj?.includes(termoBusca)
  );

  return (
    <DashboardLayout>
      <div className="mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Painel Administrativo do Sistema HELENA</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visão geral do sistema Lung Cancer Prediction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Building2 size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Hospitais</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.total_hospitais || hospitais.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Users size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Médicos</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.total_medicos || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Activity size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Pacientes</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.total_pacientes || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]"><Clock size={32} /></div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Avaliações Este Mês</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{stats.avaliacoes_mes || 0}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#0b2b3f]">Hospitais Cadastrados</h3>
            <p className="text-gray-500 font-medium text-sm">Gerencie as instituições que utilizam o sistema</p>
          </div>

          <button 
            onClick={() => navigate('/admin/cadastro-hospital')}
            className="flex items-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white px-6 py-2.5 rounded-full font-bold transition-colors shadow-sm"
          >
            <Plus size={18} /> Adicionar Hospital
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
            placeholder="Buscar por nome do hospital ou CNPJ..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-[#0b2b3f]">Hospital</th>
                <th className="py-4 font-bold text-[#0b2b3f]">CNPJ</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Cadastro</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Status</th>
                <th className="py-4 font-bold text-[#0b2b3f] text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {hospitaisFiltrados.length > 0 ? (
                hospitaisFiltrados.map((hospital) => (
                  <tr key={hospital.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#f4f9fb] p-2 rounded-lg text-[#0b2b3f]">
                          <Building2 size={20} />
                        </div>
                        <span className="font-bold text-[#0b2b3f]">{hospital.nome}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium">{hospital.cnpj}</td>
                    <td className="py-4 text-gray-600 font-medium">
                      {hospital.data_cadastro ? new Date(hospital.data_cadastro).toLocaleDateString('pt-BR') : '--'}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 font-semibold text-sm rounded-full border ${
                        hospital.ativo 
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-600 border-red-200'
                      }`}>
                        {hospital.ativo ? 'ativo' : 'inativo'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => navigate(`/admin/hospital/${hospital.id}`)}
                        className="px-4 py-2 border-2 border-[#0b2b3f] text-[#0b2b3f] font-bold text-sm rounded-lg hover:bg-[#0b2b3f] hover:text-white transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
                    Nenhuma instituição encontrada na base de dados.
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