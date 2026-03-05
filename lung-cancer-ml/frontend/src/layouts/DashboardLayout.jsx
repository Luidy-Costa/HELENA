import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Futuramente limpa o Token aqui
    navigate('/login-medico');
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
            <path d="M12 8c2 0 4-1 4-1s3-2 4-1c1.5 1.5 1 4.5 0 7-1 2.5-3.5 5-5 5-1.5 0-3-1-3-1" />
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
            <span className="text-white font-medium">Dr. João Silva</span>
            <button 
              onClick={() => navigate('/perfil-medico')}
              className="bg-white p-2 rounded-full text-[#0b2b3f] hover:bg-gray-100 transition-colors"
            >
              <User size={20} />
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-[#0b2b3f] font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}