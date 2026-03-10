import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MailPlus } from 'lucide-react'; // Trocamos o ícone para a cartinha
import AuthLayout from '../../layouts/AuthLayout';
import api from '../../services/api';

export default function ConvidarMedico() {
  const navigate = useNavigate();
  // Estado corrigido para "email" em vez de "crm"
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEnviarConvite = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      await api.post('/vinculos/convidar', { email: email });
      
      alert(`Convite enviado com sucesso para ${email}!`);
      navigate('/painel-hospital');
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert(error.response?.data?.erro || "Erro ao enviar convite. Verifique se este e-mail está cadastrado no sistema.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full flex flex-col items-center">
        
        <button 
          onClick={() => navigate('/painel-hospital')}
          className="absolute -top-6 -left-4 flex items-center gap-2 px-4 py-2 bg-[#6eb1be] text-white rounded-lg hover:bg-[#5ca0ad] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex flex-col items-center mt-12 mb-8">
          <div className="mb-4 text-[#0b2b3f]">
            <MailPlus size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-2 text-center">
            Enviar Convite
          </h2>
          <p className="text-[#6eb1be] text-center font-medium max-w-sm">
            Insira o e-mail para o qual gostaria de enviar um convite de vínculo ao hospital.
          </p>
        </div>

        <form onSubmit={handleEnviarConvite} className="w-full space-y-6">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">
              E-mail do médico
            </label>
            <input
              type="email"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
              placeholder="Digite o e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full py-3.5 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#6eb1be]/30 disabled:opacity-50"
          >
            {carregando ? "Enviando Convite..." : "Enviar Convite"}
          </button>
        </form>

      </div>
    </AuthLayout>
  );
}