import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PerfilPaciente() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Pega os dados do paciente vindos da lista
  const pacienteInicial = location.state?.paciente;

  // 2. Estados de Controle
  const [isEditing, setIsEditing] = useState(false);
  const [historico, setHistorico] = useState([]);

  // 3. Estado do Paciente (Adaptado para edição)
  const [paciente, setPaciente] = useState({
    id: '',
    nome: '',
    dataNascimento: ''
  });

  // 4. Carrega os dados na abertura da tela
  useEffect(() => {
    if (!pacienteInicial) {
      navigate('/historico-predicoes');
      return;
    }

    // Converte a data do banco para o formato YYYY-MM-DD do input type="date"
    let dataFormatada = pacienteInicial.dataNascimento;
    if (dataFormatada) {
      dataFormatada = new Date(dataFormatada).toISOString().split('T')[0];
    }

    setPaciente({
      id: pacienteInicial.id,
      nome: pacienteInicial.nome,
      dataNascimento: dataFormatada || ''
    });

    // Busca as predições deste paciente no banco
    const buscarHistorico = async () => {
      try {
        console.log("Buscando predições para o paciente ID:", pacienteInicial.id);
        
        const response = await api.get(`/pacientes/${pacienteInicial.id}/predicoes`);
        
        console.log("O Python devolveu as seguintes predições:", response.data);
        setHistorico(response.data);

        // Se a lista vier vazia mesmo com sucesso, vamos dar um aviso:
        if (response.data.length === 0) {
           alert("O Python respondeu com sucesso, mas disse que a lista de predições desse paciente está vazia [ ] no banco de dados.");
        }

      } catch (error) {
        console.error("ERRO COMPLETO DO AXIOS:", error);
        
        if (error.response) {
          alert(`ERRO DO FLASK (Status ${error.response.status}):\n${error.response.data?.erro || "Veja o terminal do Python"}`);
        } else {
          alert(`ERRO DE REDE: ${error.message}\nVocê lembrou de reiniciar o servidor Flask?`);
        }
      }
    };

    buscarHistorico();
  }, [pacienteInicial, navigate]);

  // 5. Função de Edição / Salvar
  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // Dispara a rota PUT que você já tinha criado no backend!
        await api.put(`/pacientes/${paciente.id}`, {
          nome: paciente.nome,
          data_nascimento: paciente.dataNascimento
        });
        alert("Informações atualizadas com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar paciente:", error);
        alert(error.response?.data?.erro || "Erro ao atualizar dados.");
        return; // Interrompe e não fecha a edição se der erro
      }
    }
    setIsEditing(!isEditing);
  };

  // Prevenção de quebra de tela
  if (!pacienteInicial) return null;

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para a lista
      </button>

      {/* Título da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Paciente</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visualize e edite as informações do paciente</p>
      </div>

      {/* =============== CAIXA 1: DADOS PESSOAIS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Nome */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input 
              type="text" 
              value={paciente.nome}
              onChange={(e) => setPaciente({...paciente, nome: e.target.value})}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-600'
              }`} 
            />
          </div>
          
          {/* Data Nasc (Vira calendário se estiver editando) */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input 
              type={isEditing ? "date" : "text"} 
              value={isEditing ? paciente.dataNascimento : (paciente.dataNascimento ? new Date(paciente.dataNascimento + "T00:00:00").toLocaleDateString('pt-BR') : '--')}
              onChange={(e) => setPaciente({...paciente, dataNascimento: e.target.value})}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-600'
              }`} 
            />
          </div>

          {/* ID (Sempre bloqueado, pois ID não muda) */}
          <div className="md:col-span-2 md:w-1/2 md:pr-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do paciente</label>
            <input 
              type="text" 
              value={paciente.id}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none cursor-not-allowed font-bold" 
            />
          </div>
        </div>

        {/* Botão Dinâmico (Editar / Salvar) */}
        <button 
          onClick={handleEditToggle}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-md ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-[#6eb1be] hover:bg-[#5ca0ad] text-white'
          }`}
        >
          {isEditing ? <Save size={18} /> : <Edit size={18} />}
          {isEditing ? 'Salvar Informações' : 'Editar Informações'}
        </button>
      </div>

      {/* =============== CAIXA 2: HISTÓRICO DE PREVISÕES =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Histórico de avaliações</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-[#0b2b3f]">Médico</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Data da Previsão</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Hospital</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Porcentagem</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Grau de Risco</th>
                <th className="py-4 font-bold text-[#0b2b3f]"></th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 text-gray-600 font-medium">{item.medico}</td>
                    <td className="py-5 text-gray-600 font-medium">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                    <td className="py-5 text-gray-600 font-medium">{item.hospital}</td>
                    <td className="py-5 text-gray-600 font-bold">{item.porcentagem}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 text-sm font-bold rounded-full border ${
                        item.risco === 'Alto Risco' 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : 'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {item.risco}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button 
                        onClick={() => navigate('/resultado-predicao', { state: { id_predicao: item.id } })} 
                        className="px-6 py-2 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold text-sm rounded-full hover:bg-[#6eb1be] hover:text-white transition-colors"
                      >
                        Ver Laudo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500 font-medium">
                    Nenhuma avaliação encontrada para este paciente.
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