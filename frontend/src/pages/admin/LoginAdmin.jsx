import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import api from '../../services/api';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      // Ajuste a rota '/login/admin' caso o seu backend use um nome diferente
      const response = await api.post('/login/admin', { 
        email: email, 
        senha: senha 
      });
      
      if (response.data.token) {
        localStorage.setItem('@HELENA:token', response.data.token);
        // Ajuste a rota de destino do painel admin conforme o seu projeto
        navigate('/painel-admin');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Acesso bloqueado: Credenciais de administrador revogadas.");
      } else if (error.response?.status === 401) {
        alert("E-mail ou senha incorretos.");
      } else {
        alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full">
        <button
          onClick={() => navigate('/')}
          className="absolute -top-6 -left-4 flex items-center gap-2 px-4 py-2 bg-[#6eb1be] text-white rounded-lg hover:bg-[#5ca0ad] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex flex-col items-center mt-12 mb-8">
          <div className="mb-4 text-[#0b2b3f]">
            <ShieldCheck size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-1 text-center">
            Login do Administrador
          </h2>
          <p className="text-[#6eb1be] text-lg font-medium">
            Acesso restrito à gestão do sistema
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">E-mail Administrativo</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
              placeholder="admin@helena.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#0b2b3f] hover:text-[#6eb1be] transition-colors"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <Link to="/recuperar-senha" className="text-sm font-bold text-[#6eb1be] hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3.5 mt-2 bg-[#0b2b3f] hover:bg-[#1a425e] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#0b2b3f]/30 disabled:opacity-50"
          >
            {carregando ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}