import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, Edit, Camera } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

export default function PerfilMedico() {
  const [isEditing, setIsEditing] = useState(false);
  const [carregando, setCarregando] = useState(true);
  
  // Adicionamos a "foto" no estado do médico
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

  // Lógica MÁGICA para ler a foto do computador e mostrar na tela na hora
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Guarda a foto no formato Base64 (texto) para o preview e para o banco
        setMedico({ ...medico, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // MÁGICA: Mandamos as chaves em "dobro" para o Python não ter como errar!
        await api.put('/perfil', {
          nome: medico.nome,                 // Caso o Python procure por 'nome'
          nome_completo: medico.nome,        // Caso o Python procure por 'nome_completo'
          email: medico.email,
          crm: medico.crm,
          foto: medico.foto,                 // Caso o Python procure por 'foto'
          foto_perfil: medico.foto           // Caso o Python procure por 'foto_perfil'
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Meu Perfil</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Gerencie suas informações pessoais e credenciais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* =============== CAIXA ESQUERDA: FOTO =============== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            
            <div className="relative mb-6">
              {/* Círculo da Foto (Se tiver foto mostra a imagem, se não mostra o ícone) */}
              <div className="w-32 h-32 bg-[#f4f9fb] rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {medico.foto ? (
                  <img src={medico.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className="text-[#6eb1be]" />
                )}
              </div>

              {/* INPUT INVISÍVEL PARA ARQUIVOS */}
              <input 
                type="file" 
                id="fotoInput" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFotoChange} 
              />

              {/* Botão da Câmera que "clica" no input invisível */}
              <button 
                onClick={() => document.getElementById('fotoInput').click()}
                className="absolute bottom-0 right-0 bg-[#0b2b3f] p-2.5 rounded-full text-white hover:bg-[#1a425e] transition-colors shadow-md cursor-pointer"
              >
                <Camera size={18} />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-[#0b2b3f] mb-1">{medico.nome || "Dr(a)."}</h3>
            <p className="text-[#6eb1be] font-bold mb-4">CRM: {medico.crm}</p>
            
            <div className="w-full pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium text-sm">Status da Conta</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                  Ativo
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* =============== CAIXA DIREITA: FORMULÁRIO =============== */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-[#0b2b3f]">Informações Cadastrais</h3>
              
              <button 
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                  isEditing 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-[#f4f9fb] text-[#0b2b3f] hover:bg-[#6eb1be] hover:text-white'
                }`}
              >
                {isEditing ? <Save size={16} /> : <Edit size={16} />}
                {isEditing ? 'Salvar Dados' : 'Editar Dados'}
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={medico.nome}
                    onChange={(e) => setMedico({...medico, nome: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all ${
                      isEditing 
                        ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                        : 'border-gray-200 bg-gray-50/50 text-gray-600'
                    }`} 
                  />
                </div>
              </div>

              {/* CRM AGORA É EDITÁVEL! */}
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Registro Médico (CRM)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={medico.crm}
                    onChange={(e) => setMedico({...medico, crm: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all ${
                      isEditing 
                        ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                        : 'border-gray-200 bg-gray-50/50 text-gray-600'
                    }`} 
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">E-mail Profissional</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={medico.email}
                    onChange={(e) => setMedico({...medico, email: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all ${
                      isEditing 
                        ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                        : 'border-gray-200 bg-gray-50/50 text-gray-600'
                    }`} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}