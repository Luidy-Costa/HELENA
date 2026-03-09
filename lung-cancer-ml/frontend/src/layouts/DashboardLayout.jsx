import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import api from '../services/api'; // <-- Importamos nosso mensageiro

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  // 1. Estado para guardar os dados do usuário logado
  const [perfil, setPerfil] = useState({ 
    nome: 'Carregando...', 
    foto: null 
  });

  // 2. Busca quem é o dono do Token assim que o layout é montado
  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        const response = await api.get('/perfil');
        // O backend retorna 'nome' para médico/admin e 'nome_fantasia' para hospital
        setPerfil({
          nome: response.data.nome || response.data.nome_fantasia || 'Usuário',
          foto: response.data.foto
        });
      } catch (error) {
        console.error("Erro ao carregar cabeçalho:", error);
      }
    };

    buscarDadosPerfil();
  }, []);

  // 3. Função de Logout real
  const handleLogout = () => {
    localStorage.removeItem('@LCP:token'); // Destrói o crachá VIP
    navigate('/login-medico'); // Expulsa para a tela de login
  };

  return (
    <div className="min-h-screen bg-[#f4f9fb] font-sans flex flex-col">
      
      {/* ================= HEADER (BARRA SUPERIOR) ================= */}
      <header className="bg-[#6eb1be] px-8 py-4 flex items-center justify-between shadow-md">
        
        {/* Lado Esquerdo: Logo LCP */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/painel-medico')}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v6" />
            <path d="M12 8c-2 0-4-1-4-1S5 5 4 6c-1.5 1.5-1 4.5 0 7 1 2.5 3.5 5 5 5 1.5 0 3-1 3-1" />
            <path d="M12 11c-1.5 1-3 1-3 1" />
            <path d="M12 11c1.5 1 3 1 3 1" />
            <path d="M9 16v-2" />
            <path d="M15 16v-2" />
          </svg>
          <div>
            <h1 className="text-white text-xl font-bold leading-tight">LCP</h1>
            <p className="text-white/80 text-xs font-medium">Lung Cancer Prediction</p>
          </div>
        </div>

        {/* Lado Direito: Perfil e Sair */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* O NOME AGORA É DINÂMICO! */}
            <span className="text-white font-medium">{perfil.nome}</span>
            
            <button 
              onClick={() => navigate('/perfil-medico')}
              className="bg-white p-2 rounded-full text-[#0b2b3f] hover:bg-gray-100 transition-colors overflow-hidden flex items-center justify-center w-10 h-10"
            >
              {/* SE TIVER FOTO, MOSTRA A FOTO. SE NÃO, MOSTRA O ÍCONE */}
              {perfil.foto ? (
                <img src={perfil.foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
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