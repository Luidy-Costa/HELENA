import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { usePerfilPaciente } from '../../hooks/usePerfilPaciente';

export default function PerfilPacienteHospital() {
  const navigate = useNavigate();
  const location = useLocation();
  const pacienteId = location.state?.id;

  const [isEditing, setIsEditing] = useState(false);

  // Redireciona se acessar a URL direto sem clicar em um paciente
  useEffect(() => {
    if (!pacienteId) navigate('/historico-pacientes-hospital');
  }, [pacienteId, navigate]);

  const {
    historico,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarPaciente
  } = usePerfilPaciente(pacienteId);

  const handleEditToggle = async (e) => {
    if (isEditing) {
      await atualizarPaciente(e);
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-[#6eb1be]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button 
        onClick={() => navigate('/historico-pacientes-hospital')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para predições
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Usuário</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visualize as informações do paciente</p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 font-medium">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* =============== CAIXA 1: DADOS PESSOAIS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Dados Pessoais</h3>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input 
              type="text" 
              name="nome_completo"
              value={formData.nome_completo || ''}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-600'
              }`} 
            />
          </div>
          
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input 
              type={isEditing ? "date" : "text"} 
              name="data_nascimento"
              value={isEditing ? formData.data_nascimento : (formData.data_nascimento ? new Date(formData.data_nascimento + "T00:00:00").toLocaleDateString('pt-BR') : '')}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-600'
              }`} 
            />
          </div>

          <div className="md:col-span-2 md:w-1/2 md:pr-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do paciente</label>
            <input 
              type="text" 
              value={formData.id_personalizado || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none cursor-not-allowed font-bold" 
            />
          </div>
        </form>

        <button 
          onClick={handleEditToggle}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-md disabled:opacity-50 ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-[#6eb1be] hover:bg-[#5ca0ad] text-white'
          }`}
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : (isEditing ? <Save size={18} /> : <Edit size={18} />)}
          {saving ? 'Salvando...' : (isEditing ? 'Salvar Informações' : 'Editar Informações')}
        </button>
      </div>

      {/* =============== CAIXA 2: HISTÓRICO DE PREVISÕES =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Histórico de previsões do paciente</h3>
        
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
                    <td className="py-5 text-gray-600 font-medium">{item.data_predicao}</td>
                    <td className="py-5 text-gray-600 font-medium">{item.hospital}</td>
                    <td className="py-5 text-gray-600 font-bold">{item.probabilidade_risco}%</td>
                    <td className="py-5 text-gray-600 font-medium lowercase">
                      {item.diagnostico_final}
                    </td>
                    <td className="py-5 text-right">
                      <button 
                        onClick={() => navigate('/previsao-hospital', { state: { id: item.id, pacienteId: pacienteId } })} 
                        className="px-6 py-2 border-2 border-[#6eb1be] text-[#6eb1be] font-bold text-sm rounded-full hover:bg-[#6eb1be] hover:text-white transition-colors"
                      >
                        Saiba mais
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400 font-medium">
                    Nenhum laudo encontrado para este paciente.
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