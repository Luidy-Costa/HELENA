import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import api from '../services/api';

export default function RecuperarSenha() {
  const navigate = useNavigate();
  
  const [passo, setPasso] = useState(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleEnviarEmail = async (e) => {
    e.preventDefault();
    try {
      await api.post('/senha/recuperar', { email });
      setPasso(2);
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao enviar e-mail. Verifique o endereço informado.");
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    try {
      await api.post('/senha/validar', { email, codigo });
      setPasso(3);
    } catch (error) {
      alert("Código inválido ou expirado. Verifique novamente.");
    }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    
    try {
      await api.post('/senha/redefinir', { email, codigo, nova_senha: novaSenha });
      alert("Senha alterada com sucesso! Faça login com sua nova credencial.");
      navigate('/login-medico'); 
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao redefinir a senha.");
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full flex flex-col items-center">
        <button 
          onClick={() => passo > 1 ? setPasso(passo - 1) : navigate(-1)}
          className="absolute -top-6 -left-4 flex items-center gap-2 px-4 py-2 bg-[#6eb1be] text-white rounded-lg hover:bg-[#5ca0ad] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {passo === 1 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center mt-12 mb-6">
              <Shield size={48} className="text-[#0b2b3f] mb-4" />
              <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-2">Recuperar senha</h2>
              <p className="text-[#6eb1be] text-center font-medium">
                Insira seu email para receber um código de<br/>recuperação de senha.
              </p>
            </div>

            <form onSubmit={handleEnviarEmail} className="space-y-6">
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-1">E-mail de recuperação</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                  placeholder="Digite seu e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#6eb1be]/30">
                Enviar código
              </button>
            </form>
          </div>
        )}

        {passo === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center mt-12 mb-6">
              <Mail size={48} className="text-[#0b2b3f] mb-4" />
              <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-2">Verificar código</h2>
              <p className="text-[#6eb1be] text-center font-medium">
                Digite o código de 5 dígitos enviado<br/>para o seu email
              </p>
            </div>

            <form onSubmit={handleVerificarCodigo} className="space-y-6 flex flex-col items-center">
              <input
                type="text"
                maxLength="5"
                className="w-3/4 px-4 py-3 border-2 border-[#0b2b3f] rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] text-center text-3xl tracking-[1em] font-bold"
                placeholder="•••••"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                required
              />
              <button type="submit" className="w-full py-3.5 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#6eb1be]/30">
                Verificar Código
              </button>
            </form>
          </div>
        )}

        {passo === 3 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center mt-12 mb-6">
              <Lock size={48} className="text-[#0b2b3f] mb-4" />
              <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-6">Redefinir senha</h2>
            </div>

            <form onSubmit={handleRedefinirSenha} className="space-y-4">
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nova senha</label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                    placeholder="••••••••"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#0b2b3f] hover:text-[#6eb1be]">
                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Confirme nova senha</label>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="py-3 px-8 w-full bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold transition-colors shadow-lg shadow-[#6eb1be]/30">
                  Alterar Senha
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}