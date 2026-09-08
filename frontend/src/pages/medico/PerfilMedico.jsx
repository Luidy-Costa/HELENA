import React from 'react';
import { useParams } from 'react';
import { usePerfilMedico } from '../hooks/usePerfilMedico';
import { User, Mail, Phone, Stethoscope, FileText, CheckCircle2, AlertCircle, RefreshCw, Save } from 'lucide-react';

export default function PerfilMedico() {
  const { id } = useParams();
  const {
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
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dados do médico...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Mensagens de Feedback */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <button onClick={refetch} className="text-sm underline font-medium">Tentar novamente</button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={atualizarPerfil} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner do Perfil */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white/50">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{formData.nome || 'Médico'}</h1>
            <p className="text-blue-100 flex items-center gap-1.5 text-sm mt-1">
              <Stethoscope className="h-4 w-4" />
              {formData.especialidade || 'Especialidade não informada'}
            </p>
          </div>
        </div>

        {/* Formulário de Edição */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CRM</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="crm"
                value={formData.crm}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="especialidade"
                value={formData.especialidade}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone de Contato</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Rodapé com Ação */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}