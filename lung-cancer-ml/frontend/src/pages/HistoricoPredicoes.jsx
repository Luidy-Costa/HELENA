import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Activity, FileText, Calendar, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

export default function HistoricoPredicoes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Captura o hospital da tela anterior (caso o usuário tenha vindo do HospitalInterna)
  const hospital = location.state?.hospital;

  // Estados para os pacientes e barra de pesquisa
  const [pacientes, setPacientes] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  // Busca os pacientes assim que a tela abre
  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        let response;
        // Se veio de um hospital específico, busca os pacientes dele. Se não, busca todos.
        if (hospital) {
          response = await api.get(`/hospitais/${hospital.id}/pacientes`);
        } else {
          response = await api.get('/pacientes');
        }
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    carregarPacientes();
  }, [hospital]);

  // Função para voltar sem quebrar a tela do hospital
  const handleVoltar = () => {
    if (hospital) {
      navigate('/hospital-interna', { state: { hospital } });
    } else {
      navigate('/painel-medico');
    }
  };

  // Filtro da barra de pesquisa em tempo real
  const pacientesFiltrados = pacientes.filter(p => 
    p.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    p.id?.toString().includes(termoBusca)
  );

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar Inteligente */}
      <button 
        onClick={handleVoltar}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Histórico de Perfis</h2>
        <p className="text-[#6eb1be] text-lg font-medium">
          {hospital ? `Pacientes do ${hospital.nome}` : 'Gerencie os perfis de todos os seus pacientes'}
        </p>
      </div>

      {/* Barra de Pesquisa Larga */}
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

      {/* Lista Completa de Pacientes */}
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
                    <span className="flex items-center gap-1.5"><FileText size={16} /> ID: {paciente.id}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} /> 
                      Nascimento: {paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR') : '--'}
                    </span>
                    {paciente.ultimaAtualizacao && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={16} /> 
                        Atualizado em: {new Date(paciente.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botão Ver Detalhes (Leva a bagagem do paciente para o perfil) */}
              <button 
                onClick={() => navigate('/perfil-paciente', { state: { paciente } })} 
                className="w-full md:w-auto px-6 py-2 border-2 border-[#0b2b3f] text-[#0b2b3f] font-bold rounded-lg hover:bg-[#0b2b3f] hover:text-white transition-colors flex-shrink-0"
              >
                Ver Perfil Completo
              </button>
              
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">Nenhum paciente encontrado com este nome.</p>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}