import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Building2, Save, Edit, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PerfilHospital() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [hospital, setHospital] = useState({
    nome: '',
    cnpj: '',
    email: '',
    status: 'Ativo',
    foto: null
  });

  // 1. Busca os dados assim que a tela abre
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await api.get('/perfil');
        setHospital({
          nome: response.data.nome_fantasia || response.data.nome || '',
          cnpj: response.data.cnpj || '',
          email: response.data.email || '',
          status: response.data.ativo ? 'Ativo' : 'Inativo',
          foto: response.data.foto_perfil || response.data.foto || null
        });
      } catch (error) {
        console.error("Erro ao carregar o perfil do hospital:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarPerfil();
  }, []);

  // 2. Lógica para ler a foto (Logo do Hospital)
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHospital({ ...hospital, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Salvar as alterações
  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await api.put('/perfil', {
          nome_fantasia: hospital.nome,
          nome: hospital.nome, // Enviamos em dobro pra garantir
          cnpj: hospital.cnpj,
          email: hospital.email,
          foto_perfil: hospital.foto,
          foto: hospital.foto
        });
        alert("Perfil do hospital atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert(error.response?.data?.erro || "Erro ao salvar as informações.");
        return; 
      }
    }
    setIsEditing(!isEditing);
  };

  if (carregando) {
    return <DashboardLayout><div className="p-8 font-bold text-[#6eb1be]">Carregando perfil do hospital...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      
      <button 
        onClick={() => navigate('/painel-hospital')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Hospital</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visualize o perfil do hospital no sistema LCP</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-5xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-[#0b2b3f]">Dados do Hospital</h3>
          
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
        
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          
          {/* Coluna da Foto */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#0b2b3f] font-bold text-sm">Logo do Hospital</span>
            
            <div 
              onClick={() => isEditing && document.getElementById('fotoInput').click()}
              className={`relative w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-[#f4f9fb] hover:bg-[#e6f2f5] cursor-pointer text-[#6eb1be]' 
                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-default'
              }`}
            >
              {hospital.foto ? (
                <img src={hospital.foto} alt="Logo Hospital" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} />
              )}
              
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

          {/* Campos de Texto */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome do Hospital</label>
              <input 
                type="text" 
                value={hospital.nome}
                onChange={(e) => setHospital({...hospital, nome: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed'
                }`} 
              />
            </div>
            
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">CNPJ</label>
              <input 
                type="text" 
                value={hospital.cnpj}
                onChange={(e) => setHospital({...hospital, cnpj: e.target.value})}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  isEditing 
                    ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be] text-[#0b2b3f]' 
                    : 'border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed'
                }`} 
              />
            </div>

            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">E-mail Administrativo</label>
              <input 
                type="email" 
                value={hospital.email}
                onChange={(e) => setHospital({...hospital, email: e.target.value})}
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

        {/* Controle do Sistema */}
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Controle do Sistema</h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Status da Conta</label>
            <div className="flex gap-4">
               <span className={`px-8 py-2 rounded-full font-bold text-sm border ${
                  hospital.status === 'Ativo' 
                    ? 'bg-green-100 text-green-700 border-green-300' 
                    : 'bg-red-100 text-red-600 border-red-300'
                }`}>
                 {hospital.status}
               </span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}