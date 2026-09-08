import React from 'react';
import { useParams } from 'react';
import { useHospital } from '../hooks/useHospital';
import { Search, Activity, Users, AlertCircle, RefreshCw } from 'lucide-react';

export default function HospitalInterna() {
  const { id } = useParams();
  const { 
    hospitalData, 
    pacientes, 
    loading, 
    error, 
    filtro, 
    setFiltro, 
    refetch 
  } = useHospital(id);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dados da unidade...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex items-center text-red-700">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>{error}</span>
        <button onClick={refetch} className="ml-auto underline font-semibold">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho do Hospital */}
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{hospitalData?.nome || 'Unidade Hospitalar'}</h1>
          <p className="text-sm text-gray-500">{hospitalData?.endereco || 'Setor Interno de Gestão'}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <Users className="h-5 w-5" />
            <span className="font-semibold">{pacientes.length} Internados</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
            <Activity className="h-5 w-5" />
            <span className="font-semibold">{hospitalData?.leitosDisponiveis || 0} Leitos Livres</span>
          </div>
        </div>
      </header>

      {/* Barra de Filtros e Busca */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do paciente ou CPF..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tabela/Lista de Pacientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4">Paciente</th>
              <th className="p-4">Leito</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {pacientes.length > 0 ? (
              pacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{paciente.nome}</td>
                  <td className="p-4">{paciente.leito || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      paciente.status === 'Estável' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {paciente.status || 'Em Observação'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline font-medium">Ver Prontuário</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  Nenhum paciente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}