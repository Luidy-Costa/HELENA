import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, Edit, ArrowLeft, User } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PerfilMedico() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [carregando, setCarregando] = useState(true);
  
  const [medico, setMedico] = useState({
    nome: '',
    email: '',
    crm: '',
    foto: null
  });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await api.get('/perfil');
        setMedico({
          nome: response.data.nome || response.data.nome_completo || '',
          email: response.data.email || '',
          crm: response.data.crm || '',
          foto: response.data.foto || response.data.foto_perfil || null
        });
      } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarPerfil();
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedico({ ...medico, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await api.put('/perfil', {
          nome: medico.nome,                 
          nome_completo: medico.nome,        
          email: medico.email,
          crm: medico.crm,
          foto: medico.foto,                 
          foto_perfil: medico.foto           
        });
        alert("Perfil atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert(error.response?.data?.erro || "Erro ao salvar as informações.");
        return; 
      }
    }
    setIsEditing(!isEditing);
  };

  if (carregando) {
    return <DashboardLayout><div className="p-8 font-bold text-[#6eb1be]">Carregando seu perfil...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/painel-medico')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
      </button>

      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Meu Perfil</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visualize e gerencie suas informações no sistema LCP</p>
      </div>

      {/* Cartão Principal (Estilo Hospital) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-5xl">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Dados do Médico</h3>
        
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          
          {/* Coluna Esquerda: Foto */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#0b2b3f] font-bold text-sm">Foto de perfil</span>
            
            {/* Caixa da Foto Clicável */}
            <div 
              onClick={() => isEditing && document.getElementById('fotoInput').click()}
              className={`relative w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-[#f4f9fb] hover:bg-[#e6f2f5] cursor-pointer text-[#6eb1be]' 
                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-default'
              }`}
            >
              {medico.foto ? (
                <img src={medico.foto} alt="Perfil Médico" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
              
              {/* Ícone de câmera que aparece ao passar o mouse (só no modo edição) */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              id="fotoInput" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFotoChange} 
            />
            
            <span className="text-xs text-gray-400 font-medium">
              {isEditing ? "Clique para alterar" : "Modo visualização"}
            </span>
          </div>

          {/* Coluna Direita: Campos de Texto sem os ícones, igual ao hospital */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={medico.nome}
                onChange={(e) => setMedico({...medico, nome: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed'
                }`} 
              />
            </div>
            
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">CRM</label>
              <input 
                type="text" 
                value={medico.crm}
                onChange={(e) => setMedico({...medico, crm: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed'
                }`} 
              />
            </div>

            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">E-mail Profissional</label>
              <input 
                type="email" 
                value={medico.email}
                onChange={(e) => setMedico({...medico, email: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed'
                }`} 
              />
            </div>
          </div>
        </div>

        {/* Ações e Controle */}
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Ações da Conta</h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Status</label>
            <span className="inline-flex items-center px-8 py-2 bg-green-100 text-green-700 border border-green-300 rounded-full font-bold text-sm shadow-sm cursor-default">
              Ativo
            </span>
          </div>

          <button 
            onClick={handleEditToggle}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-md mt-4 sm:mt-0 ${
              isEditing 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-[#6eb1be] hover:bg-[#5ca0ad] text-white'
            }`}
          >
            {isEditing ? <Save size={18} /> : <Edit size={18} />}
            {isEditing ? 'Salvar alterações' : 'Editar informações'}
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}