import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePerfilPaciente } from "../../hooks/usePerfilPaciente";
import { Save, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function PerfilPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    historico,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarPaciente,
    refetch
  } = usePerfilPaciente(id);

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
      <div className="max-w-6xl mx-auto space-y-6">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Título da Página */}
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Usuário</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visualize as informações do paciente</p>
        </div>

        {/* Alertas de Erro/Sucesso */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <button onClick={refetch} className="text-sm underline font-bold">Tentar novamente</button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Card 1: Dados Pessoais */}
        <form onSubmit={atualizarPaciente} className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-2xl font-bold text-[#0b2b3f] mb-8">Dados Pessoais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="md:col-span-1">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-3">Nome completo</label>
              <input
                type="text"
                name="nome_completo"
                value={formData.nome_completo || ''}
                onChange={handleChange}
                placeholder="Ex: Luisa da Silva"
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] bg-white transition-all"
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-3">Data de nascimento</label>
              <input
                type="text"
                name="data_nascimento"
                value={formData.data_nascimento || ''}
                onChange={handleChange}
                placeholder="AAAA-MM-DD"
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] bg-white transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-3">Id do paciente</label>
              <input
                type="text"
                name="id_personalizado"
                value={formData.id_personalizado || ''}
                readOnly
                placeholder="PRN-2026-001"
                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'Salvando...' : 'Editar Informações'}
          </button>
        </form>

        {/* Card 2: Histórico */}
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-2xl font-bold text-[#0b2b3f] mb-8">Histórico de previsões do paciente</h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Cabeçalho da Tabela */}
              <div className="grid grid-cols-6 gap-4 text-[#0b2b3f] font-bold text-sm pb-4 border-b border-gray-200 mb-2">
                <div>Médico</div>
                <div>Data da Previsão</div>
                <div>Hospital</div>
                <div>Porcentagem</div>
                <div>Grau de Risco</div>
                <div></div> {/* Coluna vazia para o botão */}
              </div>

              {/* Linhas da Tabela */}
              {historico.length > 0 ? (
                historico.map((item, index) => (
                  <div key={item.id || index} className="grid grid-cols-6 gap-4 items-center py-5 border-b border-gray-100 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2">
                    <div>{item.medico}</div>
                    <div>{item.data_predicao}</div>
                    <div>{item.hospital}</div>
                    <div>{item.probabilidade_risco}%</div>
                    <div>{item.diagnostico_final}</div>
                    <div className="flex justify-end pr-2">
                      <button 
                        onClick={() => navigate(`/resultado-predicao/${item.id}`)}
                        className="border border-[#0b2b3f] text-[#0b2b3f] hover:bg-[#0b2b3f] hover:text-white px-6 py-1.5 rounded-full text-xs font-bold transition-colors"
                      >
                        Saiba mais
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 font-medium">
                  Nenhuma previsão registrada para este paciente.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}