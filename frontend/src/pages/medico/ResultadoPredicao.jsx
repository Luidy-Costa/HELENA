import React from 'react';
import { useParams, useNavigate } from 'react';
import { useResultadoPredicao } from '../hooks/useResultadoPredicao';
import { 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Save, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle,
  Activity
} from 'lucide-react';

export default function ResultadoPredicao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    predicao,
    observacaoMedica,
    setObservacaoMedica,
    loading,
    saving,
    error,
    successMessage,
    salvarParecer,
    refetch
  } = useResultadoPredicao(id);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Processando resultados do modelo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between max-w-4xl mx-auto my-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <button onClick={refetch} className="text-sm underline font-medium">Tentar novamente</button>
      </div>
    );
  }

  const nivelRisco = predicao?.nivelRisco || 'Baixo'; // Ex: 'Alto', 'Médio', 'Baixo'
  const probabilidade = predicao?.probabilidade || 0;

  // Formatação de cor dinâmica por nível de risco
  const getBadgeStyle = (risco) => {
    switch (risco.toLowerCase()) {
      case 'alto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'médio':
      case 'medio':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      {/* Header com Resultado do Modelo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Resultado da Análise Preditiva</h1>
              <p className="text-sm text-gray-500">Paciente: {predicao?.nomePaciente || 'Paciente Indefinido'}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getBadgeStyle(nivelRisco)}`}>
            Risco {nivelRisco}
          </span>
        </div>

        {/* Indicador de Probabilidade */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-blue-600" />
              Probabilidade Estimada
            </span>
            <span className="text-gray-900 font-bold">{probabilidade}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${
                probabilidade > 70 ? 'bg-red-500' : probabilidade > 30 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${probabilidade}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fatores de Risco Identificados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Fatores de Maior Relevância
        </h2>
        <ul className="divide-y divide-gray-100 text-sm">
          {predicao?.fatores?.length > 0 ? (
            predicao.fatores.map((fator, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span className="text-gray-700 font-medium">{fator.nome}</span>
                <span className="text-gray-500">{fator.impacto}</span>
              </li>
            ))
          ) : (
            <li className="py-3 text-gray-400">Nenhum fator de risco crítico detectado.</li>
          )}
        </ul>
      </div>

      {/* Campo para Parecer do Médico */}
      <form onSubmit={salvarParecer} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Parecer Médico e Observações
        </h2>

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}

        <textarea
          rows={4}
          value={observacaoMedica}
          onChange={(e) => setObservacaoMedica(e.target.value)}
          placeholder="Insira as observações médicas, conduta tomada ou validação da predição..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Salvando...' : 'Salvar Parecer'}
          </button>
        </div>
      </form>
    </div>
  );
}