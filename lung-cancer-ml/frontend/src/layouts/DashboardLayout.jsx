import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import api from '../services/api';
import logoImg from '../assets/logo.png';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  // 1. Estado para guardar os dados do usuário logado
  const [perfil, setPerfil] = useState({ 
    nome: 'Carregando...', 
    foto: null 
  });

  // 2. Busca os dados do usuário assim que o layout é montado
  useEffect(() => {
    const buscarDadosPerfil = async () => {
    try {
      const response = await api.get('/perfil');
      // Usando setPerfil corretamente!
      setPerfil({
        nome: response.data.nome || response.data.nome_completo || 'Médico(a)',
        foto: response.data.foto || response.data.foto_perfil || null
      });
    } catch (error) {
      console.error("Erro ao carregar cabeçalho:", error);
      // Fallback seguro se o backend falhar
      setPerfil({ nome: 'Usuário', foto: null });
    }
  };

    buscarDadosPerfil();
  }, []);

  // 3. Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('@LCP:token'); 
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-[#f4f9fb] font-sans flex flex-col">
      
      {/* ================= HEADER ================= */}
      <header className="bg-[#6eb1be] px-8 py-4 flex items-center justify-between shadow-md">
        
        {/* Logo LCP */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/painel-medico')}>
          <img 
            src={logoImg} 
            alt="LCP Logo" 
            className="w-10 h-10 object-contain rounded-md" 
          />
          <div>
            <h1 className="text-white text-xl font-bold leading-tight">LCP</h1>
            <p className="text-white/80 text-xs font-medium">Lung Cancer Prediction</p>
          </div>
        </div>

        {/* Lado Direito: Perfil e Sair */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">{perfil.nome}</span>
            
            {/* CORREÇÃO AQUI: Botão de Perfil Blindado */}
            <button 
              onClick={() => navigate('/')}
              className="rounded-full overflow-hidden flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-100 transition-colors shadow-sm"
            >
              {perfil.foto ? (
                // A mágica: w-full h-full object-cover garantem o preenchimento perfeito
                <img src={perfil.foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-[#0b2b3f]" />
              )}
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </header>

      {/* ================= CONTEÚDO DA PÁGINA (CHILDREN) ================= */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}