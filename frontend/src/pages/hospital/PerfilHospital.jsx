import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePerfilHospital } from '../../hooks/usePerfilHospital';
import { ArrowLeft, Mail, Save, RefreshCw, AlertCircle, CheckCircle2, ImagePlus } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function PerfilHospital() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    hospital,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarHospital,
    refetch
  } = usePerfilHospital(id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-[#6eb1be]" />
        </div>
      </DashboardLayout>
    );
  }

  // Pega a data de cadastro vinda do banco ou deixa um aviso
  const dataCadastroFormatada = hospital?.data_cadastro 
    ? new Date(hospital.data_cadastro).toLocaleDateString('pt-BR') 
    : 'Não informada pelo sistema';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Botão Voltar */}
        <button  
          onClick={() => navigate(-1)}  
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm" 
        > 
          <ArrowLeft size={16} /> Voltar 
        </button> 

        {/* Cabeçalho da Página */}
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil da Instituição</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visualize os dados do Hospital no sistema HELENA</p>
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
            Dados da Instituição
          </h3>

          <form onSubmit={atualizarHospital} className="flex flex-col md:flex-row gap-10">
            
            {/* Coluna da Foto (Esquerda) */}
            <div className="flex flex-col items-start shrink-0">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-3">Adicionar logotipo</label>
              <div className="w-40 h-40 rounded-2xl border-2 border-[#6eb1be] flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors mb-2">
                <ImagePlus size={48} className="text-[#6eb1be]" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold text-gray-400">Imagem da Instituição</span>
            </div>

            {/* Coluna dos Campos (Direita) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              <div className="md:col-span-2">
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  name="nome_fantasia"
                  value={formData.nome_fantasia || ''}
                  onChange={handleChange}
                  placeholder="Ex: Hospital São Lucas"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj || ''}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                  <Mail size={16} /> E-mail Institucional
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="contato@hospital.com.br"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
                <p className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">
                  Usado para recuperação de senha
                </p>
              </div>

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

              {/* Botão de Salvar */}
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