import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePerfilMedico } from "../../hooks/usePerfilMedico";
import { Mail, Save, RefreshCw, AlertCircle, CheckCircle2, ImagePlus, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function PerfilMedico() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    medico,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarPerfil,
    refetch
  } = usePerfilMedico(id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-[#6eb1be]" />
        </div>
      </DashboardLayout>
    );
  }

  // Prepara a data ou avisa que o sistema não a enviou
  const dataCadastroFormatada = medico?.data_cadastro 
    ? new Date(medico.data_cadastro).toLocaleDateString('pt-BR') 
    : 'Não informada pelo sistema';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6"> {/* Espaçamento reduzido de y-8 para y-6 */}
        
        {/* BOTÃO DE VOLTAR ADICIONADO AQUI */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        
        {/* Cabeçalho da Página */}
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Médico</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visualize o perfil do Médico no sistema HELENA</p>
        </div>

        {/* Alertas */}
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

        {/* Card Principal */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          <h3 className="text-xl font-bold text-[#0b2b3f] mb-8 border-b border-gray-100 pb-4">
            Dados do Médico
          </h3>

          <form onSubmit={atualizarPerfil} className="flex flex-col md:flex-row gap-10">
            
            {/* Coluna da Foto (Esquerda) */}
            <div className="flex flex-col items-start shrink-0">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-3">Adicionar foto de perfil</label>
              <div className="w-40 h-40 rounded-2xl border-2 border-[#6eb1be] flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors mb-2">
                <ImagePlus size={48} className="text-[#6eb1be]" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold text-gray-400">Imagem do Médico</span>
            </div>

            {/* Coluna dos Campos (Direita) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              {/* Nome - Ocupa 2 colunas */}
              <div className="md:col-span-2">
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Nome do Médico</label>
                <input
                  type="text"
                  name="nome_completo"
                  value={formData.nome_completo || ''}
                  onChange={handleChange}
                  placeholder="Ex: João Silva Costa"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              {/* CRM - 1 coluna */}
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">CRM</label>
                <input
                  type="text"
                  name="crm"
                  value={formData.crm || ''}
                  onChange={handleChange}
                  placeholder="123456-SP"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              {/* E-mail - 1 coluna */}
              <div>
                <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                  <Mail size={16} /> E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="medico@hospital.com.br"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
                <p className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">
                  Este e-mail será usado para recuperação de senha
                </p>
              </div>

              {/* Data de Cadastro - 1 coluna */}
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Data de cadastro</label>
                <input
                  type="text"
                  readOnly
                  value={dataCadastroFormatada}
                  placeholder="dd/mm/aaaa"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              {/* Botão de Salvar - Alinhado à direita na última linha */}
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}