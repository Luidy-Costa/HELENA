import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import api from '../services/api';
import logoImg from '../assets/logo.png';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [perfil, setPerfil] = useState({ 
    nome: 'Carregando...', 
    foto: null 
  });

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        const response = await api.get('/perfil');
        setPerfil({
          nome: response.data.nome || response.data.nome_completo || 'Usuário',
          foto: response.data.foto || response.data.foto_perfil || null
        });
      } catch (error) {
        console.error("Erro ao carregar cabeçalho:", error);
        setPerfil({ nome: 'Usuário', foto: null });
      }
    };

    buscarDadosPerfil();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@HELENA:token'); 
    localStorage.removeItem('@LCP:token'); 
    navigate('/'); 
  };

  const irParaPainel = () => {
    if (location.pathname.includes('hospital')) {
      navigate('/painel-hospital');
    } else {
      navigate('/painel-medico');
    }
  };

  const irParaPerfil = () => {
    if (location.pathname.includes('hospital')) {
      navigate('/perfil-hospital');
    } else {
      navigate('/perfil-medico');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f9fb] font-sans flex flex-col">
      <header className="bg-[#6eb1be] px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4 cursor-pointer" onClick={irParaPainel}>
          <img 
            src={logoImg} 
            alt="HELENA Logo" 
            className="w-10 h-10 object-contain rounded-md" 
          />
          <div>
            <h1 className="text-white text-xl font-bold leading-tight">HELENA</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">{perfil.nome}</span>
            <button 
              type="button"
              onClick={irParaPerfil}
              className="rounded-full overflow-hidden flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-100 transition-colors shadow-sm"
            >
              {perfil.foto ? (
                <img src={perfil.foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-[#0b2b3f]" />
              )}
            </button>
          </div>

          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}