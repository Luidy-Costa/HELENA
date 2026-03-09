import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Camera, User, Mail, FileBadge, Calendar } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

export default function PainelMedico() {
  const navigate = useNavigate();

  // Novo estado para as estatísticas reais
  const [estatisticas, setEstatisticas] = useState({
    total_predicoes: 0,
    pacientes_atendidos: 0,
    casos_graves: 0 // No backend de dashboard_service.py retorna como 'casos_graves' ou 'pacientes_risco' dependendo do nome que você colocou. Pelo seu código, parece ser "casos_graves".
  });

  // Dispara ao carregar a página
  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const response = await api.get('/dashboard/resumo');
        setEstatisticas(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };
    carregarDashboard();
  }, []);

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Título da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Meu Perfil</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Gerencie suas informações pessoais e credenciais</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
        
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Coluna Esquerda: Foto de Perfil */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#f4f9fb] shadow-md">
                {medico.fotoUrl ? (
                  <img src={medico.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <User size={64} />
                  </div>
                )}
              </div>
              
              {/* Botão de alterar foto (só aparece se estiver editando) */}
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white p-3 rounded-full shadow-lg transition-colors border-2 border-white">
                  <Camera size={20} />
                </button>
              )}
            </div>
            {isEditing && (
              <p className="text-xs text-gray-500 mt-3 font-medium text-center">Clique no ícone para<br/>alterar a foto</p>
            )}
          </div>

          {/* Coluna Direita: Formulário */}
          <div className="flex-1 space-y-6">
            
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                <User size={16} className="text-[#6eb1be]" /> Nome completo
              </label>
              <input 
                type="text" 
                value={medico.nome}
                onChange={(e) => setMedico({...medico, nome: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-600'
                }`} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CRM */}
              <div>
                <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                  <FileBadge size={16} className="text-[#6eb1be]" /> CRM
                </label>
                <input 
                  type="text" 
                  value={medico.crm}
                  onChange={(e) => setMedico({...medico, crm: e.target.value})}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                    isEditing 
                      ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be]' 
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                  }`} 
                />
              </div>

              {/* Data de Cadastro (Sempre bloqueada) */}
              <div>
                <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                  <Calendar size={16} className="text-gray-400" /> Data de cadastro
                </label>
                <input 
                  type="text" 
                  value={medico.dataCadastro}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-500 outline-none cursor-not-allowed" 
                />
              </div>
            </div>

            {/* Email de Recuperação */}
            <div>
              <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                <Mail size={16} className="text-[#6eb1be]" /> E-mail de recuperação
              </label>
              <input 
                type="email" 
                value={medico.email}
                onChange={(e) => setMedico({...medico, email: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-600'
                }`} 
              />
            </div>

            {/* Botão de Ação */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-md ${
                  isEditing 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-[#6eb1be] hover:bg-[#5ca0ad] text-white'
                }`}
              >
                {isEditing ? <Save size={20} /> : <Edit size={20} />}
                {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
              </button>
            </div>

          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}