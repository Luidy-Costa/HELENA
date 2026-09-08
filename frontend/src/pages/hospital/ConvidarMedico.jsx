import React from "react";
import { useConvidarMedico } from "../../hooks/useConvidarMedico";
import {
  Mail,
  FileText,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function ConvidarMedico() {
  const {
    email,
    setEmail,
    crm,
    setCrm,
    loading,
    error,
    successMessage,
    enviarConvite,
  } = useConvidarMedico();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Convidar Médico para a Equipe
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Envie um convite de acesso para vincular um novo médico à sua
            unidade.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={enviarConvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail do Médico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="medico@hospital.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CRM
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                placeholder="123456/SP"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            {loading ? "Enviando..." : "Enviar Convite"}
          </button>
        </form>
      </div>
    </div>
  );
}
