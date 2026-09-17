import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Save, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout'; 
import api from '../../services/api';

export default function PerfilMedicoAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const medicoId = location.state?.medico_id;
  const hospitalId = location.state?.hospital_id;

  const [medico, setMedico] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!medicoId || !hospitalId) {
      navigate('/painel-admin');
      return;
    }

    const carregarDadosDoMedico = async () => {
      try {
        const res = await api.get(`/admin/hospital/${hospitalId}/medicos`);
        const medicoEncontrado = res.data.find(m => m.id === medicoId);

        if (medicoEncontrado) {
          setMedico({
            ...medicoEncontrado,
            status: medicoEncontrado.ativo ? 'Ativo' : 'Inativo'
          });
        } else {
          alert("Médico não encontrado no contexto deste hospital.");
          navigate(`/admin/hospital/${hospitalId}`);
        }
      } catch (error) {
        console.error("Erro ao carregar médico (Admin):", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDoMedico();
  }, [medicoId, hospitalId, navigate]);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await api.put(`/admin/hospital/${hospitalId}/medicos/${medicoId}/status`, {
        ativo: medico.status === 'Ativo'
      });
      alert(`Status de suporte atualizado com sucesso para ${medico.status}!`);
      navigate(`/admin/hospital/${hospitalId}`);
    } catch (error) {
      alert("Erro ao salvar a alteração de status pelo Admin Geral.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando || !medico) {
    return <DashboardLayout><div className="flex h-40 items-center justify-center"><RefreshCw className="animate-spin text-[#6eb1be] w-10 h-10" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <button 
        onClick={() => navigate(`/admin/hospital/${hospitalId}`)}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para a Instituição
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Suporte: Perfil do Médico</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Auditoria e controle de acesso (Visão Admin Geral)</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-5xl">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Identificação do Profissional</h3>
        
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#0b2b3f] font-bold text-sm">Foto de perfil</span>
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50 overflow-hidden">
              <User size={40} />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-500 font-bold text-sm mb-1">Nome Completo</label>
              <input type="text" value={medico.nome_completo} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
            </div>
            <div>
              <label className="block text-gray-500 font-bold text-sm mb-1">CRM</label>
              <input type="text" value={medico.crm} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
            </div>
            <div>
              <label className="block text-gray-500 font-bold text-sm mb-1">E-mail</label>
              <input type="email" value={medico.email} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Controle de Acesso Institucional</h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Status do Médico neste Hospital</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setMedico({...medico, status: 'Ativo'})}
                className={`px-8 py-2 rounded-full font-bold text-sm transition-all border ${
                  medico.status === 'Ativo' ? 'bg-green-100 text-green-700 border-green-300 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Ativo
              </button>
              <button 
                onClick={() => setMedico({...medico, status: 'Inativo'})}
                className={`px-8 py-2 rounded-full font-bold text-sm transition-all border ${
                  medico.status === 'Inativo' ? 'bg-red-100 text-red-600 border-red-300 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Inativo
              </button>
            </div>
          </div>

          <button 
            onClick={handleSalvar}
            disabled={salvando}
            className="flex items-center gap-2 px-8 py-3 bg-[#0b2b3f] hover:bg-[#1a425e] text-white rounded-full font-bold transition-all shadow-md mt-4 sm:mt-0 disabled:opacity-50"
          >
            {salvando ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            Aplicar Status
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}