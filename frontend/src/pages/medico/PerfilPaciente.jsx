import React from 'react';
import { useParams, useNavigate } from 'react';
import { usePerfilPaciente } from '../hooks/usePerfilPaciente';
import { 
  User, 
  Phone, 
  Calendar, 
  AlertTriangle, 
  FileSpreadsheet, 
  Clock, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

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
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando prontuário do paciente...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      {/* Feedback de Erro ou Sucesso */}
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

      {/* Formulário do Perfil e Prontuário */}
      <form onSubmit={atualizarPaciente} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-800 p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold border border-slate-600">
            <User className="h-8 w-8 text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{formData.nome || 'Paciente'}</h1>
            <p className="text-slate-400 text-sm mt-1">CPF: {formData.cpf || 'Não informado'}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Alergias Conocidas</label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
              <input
                type="text"
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                placeholder="Ex: Penicilina, Dipirona"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comorbidades e Condições Próximas</label>
            <textarea
              rows={3}
              name="comorbidades"
              value={formData.comorbidades}
              onChange={handleChange}
              placeholder="Ex: Hipertensão, Diabetes Tipo 2..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'Salvando...' : 'Atualizar Prontuário'}
          </button>
        </div>
      </form>

      {/* Histórico Clínico */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Histórico de Atendimentos
        </h2>

        {historico.length > 0 ? (
          <div className="space-y-3">
            {historico.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.descricao || 'Consulta Médica'}</p>
                  <p className="text-xs text-gray-500 mt-1">Médico Responsável: {item.medico || 'Não informado'}</p>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  {item.data || 'Data N/I'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">Nenhum registro no histórico clínico.</p>
        )}
      </div>
    </div>
  );
}