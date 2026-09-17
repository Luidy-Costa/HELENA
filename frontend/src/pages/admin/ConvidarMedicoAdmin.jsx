import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, FileText, Send, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

export default function ConvidarMedicoAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalId = location.state?.hospital_id;

  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const enviarConvite = async (e) => {
    e.preventDefault();
    if (!hospitalId) {
      setError("Erro de contexto: ID do hospital não encontrado.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await api.post(`/admin/hospital/${hospitalId}/convite`, { email, crm });
      setSuccessMessage("Convite de suporte enviado com sucesso para o médico!");
      setEmail("");
      setCrm("");
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao tentar enviar o convite pelo painel global.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button  
          onClick={() => navigate(-1)}  
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm" 
        > 
          <ArrowLeft size={16} /> Voltar para a Instituição
        </button> 

        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">
            Suporte: Convidar Médico
          </h2>
          <p className="text-[#6eb1be] text-lg font-medium">
            Envie um convite de acesso para vincular um profissional a este hospital.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
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

          <form onSubmit={enviarConvite} className="space-y-6">
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-2">E-mail do Médico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="medico@exemplo.com.br"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-2">CRM</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  placeholder="123456-SP"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#0b2b3f] hover:bg-[#1a425e] text-white font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {loading ? "Enviando..." : "Disparar Convite"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}