import React from 'react';
import { useParams } from 'react_router_dom';
import { usePerfilHospital } from '../../hooks/usePerfilHospital';
import { Building2, MapPin, Phone, Bed, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PerfilHospital() {
  const { id } = useParams();
  const {
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
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dados institucionais...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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

      <form onSubmit={atualizarHospital} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold border border-slate-700">
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{formData.nome || 'Instituição Hospitalar'}</h1>
            <p className="text-slate-400 text-sm mt-1">CNPJ: {formData.cnpj || 'Não cadastrado'}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social / Nome Fantasia</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacidade Total de Leitos</label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="leitosTotais"
                value={formData.leitosTotais}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}