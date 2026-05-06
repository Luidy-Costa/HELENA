import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Activity, Clock, Search } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PainelMedico() {
  const navigate = useNavigate();

  // 1. Estado para guardar as estatísticas que virão do Postgres
  const [estatisticas, setEstatisticas] = useState({
    total_predicoes: 0,
    pacientes_atendidos: 0,
    casos_graves: 0
  });

  // 2. Estado para a lista real de hospitais vinculados ao médico
  const [hospitais, setHospitais] = useState([]);

  // 3. Busca os dados no Flask automaticamente assim que a tela abre
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const response = await api.get('/dashboard/resumo');
        setEstatisticas(response.data); // Salva os dados do banco no estado
      } catch (error) {
        console.error("Erro ao buscar resumo:", error);
        // Se der erro 401 (Não Autorizado), o Token expirou ou sumiu. Mandamos pro login.
        if (error.response?.status === 401) {
          localStorage.removeItem('@LCP:token');
          navigate('/login-medico');
        }
      }
    };

    // NOVA FUNÇÃO: Busca os hospitais vinculados
    const carregarHospitais = async () => {
      try {
        const response = await api.get('/dashboard/meus-hospitais');
        setHospitais(response.data);
      } catch (error) {
        console.error("Erro ao carregar hospitais:", error);
      }
    };

    carregarEstatisticas();
    carregarHospitais(); // Chama a nova função ao carregar a tela
  }, [navigate]);

  return (
    <DashboardLayout>
      
      {/* Título da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Painel Administrativo do Médico</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visão geral do sistema Lung Cancer Prediction</p>
      </div>

      {/* Grid de Cards Estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Hospitais */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]">
            <Building2 size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Hospitais</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{hospitais.length}</h3>
          </div>
        </div>

        {/* Card 2: Pacientes Atendidos */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Total de Pacientes</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{estatisticas.pacientes_atendidos}</h3>
          </div>
        </div>

        {/* Card 3: Predições Feitas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="bg-[#f4f9fb] p-4 rounded-lg text-[#0b2b3f]">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[#6eb1be] font-bold text-sm">Avaliações Feitas</p>
            <h3 className="text-3xl font-bold text-[#0b2b3f]">{estatisticas.total_predicoes}</h3>
          </div>
        </div>
      </div>

      {/* Seção da Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#0b2b3f]">Hospitais Cadastrados</h3>
          <p className="text-gray-500 font-medium text-sm">Gerencie as instituições que utilizam o sistema</p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
            placeholder="Buscar por hospital..."
          />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-[#0b2b3f]">Hospital</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Médicos</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Pacientes</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Status</th>
                <th className="py-4 font-bold text-[#0b2b3f] text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {hospitais.length > 0 ? (
                hospitais.map((hospital) => (
                  <tr key={hospital.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#f4f9fb] p-2 rounded-lg text-[#0b2b3f]">
                          <Building2 size={20} />
                        </div>
                        <span className="font-bold text-[#0b2b3f]">{hospital.nome}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium">{hospital.medicos}</td>
                    <td className="py-4 text-gray-600 font-medium">{hospital.pacientes}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold text-sm rounded-full border border-green-200">
                        {hospital.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => navigate('/hospital-interna', { state: { hospital } })} 
                        className="px-4 py-2 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold text-sm rounded-lg hover:bg-[#6eb1be] hover:text-white transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
                    Nenhum hospital vinculado ainda.
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