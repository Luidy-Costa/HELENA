import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Building2, Save, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout'; // Ajuste o caminho se necessário

export default function PerfilHospital() {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState({
    nome: 'Hospital São Lucas',
    cnpj: '548.745.566/0008-88',
    email: 'hospital@saolucas.com.br',
    status: 'Ativo',
    foto: null
  });

  const handleSalvar = () => {
    console.log("Salvando alterações do hospital:", hospital);
    alert("Perfil do hospital atualizado com sucesso!");
    navigate('/painel-hospital');
  };

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
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Dados do Hospital</h3>
        
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          
          {/* Adicionar Foto */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#0b2b3f] font-bold text-sm">Adicionar foto de perfil</span>
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#6eb1be] flex flex-col items-center justify-center text-[#6eb1be] bg-[#f4f9fb] hover:bg-[#e6f2f5] cursor-pointer transition-colors">
              {hospital.foto ? (
                <img src={hospital.foto} alt="Logo Hospital" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 size={40} />
              )}
            </div>
            <span className="text-xs text-gray-400 font-medium">Imagem do Hospital</span>
          </div>

          {/* Campos de Texto */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome do Hospital</label>
              <input 
                type="text" 
                value={hospital.nome}
                onChange={(e) => setHospital({...hospital, nome: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#6eb1be] text-gray-700" 
              />
            </div>
            
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">CNPJ</label>
              <input 
                type="text" 
                value={hospital.cnpj}
                onChange={(e) => setHospital({...hospital, cnpj: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#6eb1be] text-gray-700" 
              />
            </div>

            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">E-mail</label>
              <input 
                type="email" 
                value={hospital.email}
                onChange={(e) => setHospital({...hospital, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#6eb1be] text-gray-700" 
              />
              <p className="text-xs text-gray-400 mt-1">Este e-mail será usado para recuperação de senha</p>
            </div>
          </div>
        </div>

        {/* Controle do Sistema */}
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Controle do Sistema</h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Status</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setHospital({...hospital, status: 'Ativo'})}
                className={`px-8 py-2 rounded-full font-bold text-sm transition-all border ${
                  hospital.status === 'Ativo' 
                    ? 'bg-green-100 text-green-700 border-green-300 shadow-sm' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Ativo
              </button>
              <button 
                onClick={() => setHospital({...hospital, status: 'Inativo'})}
                className={`px-8 py-2 rounded-full font-bold text-sm transition-all border ${
                  hospital.status === 'Inativo' 
                    ? 'bg-red-100 text-red-600 border-red-300 shadow-sm' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Inativo
              </button>
            </div>
          </div>

          <button 
            onClick={handleSalvar}
            className="flex items-center gap-2 px-8 py-3 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-full font-bold transition-all shadow-md mt-4 sm:mt-0"
          >
            <Save size={18} /> Salvar alterações
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}