import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import api from '../../services/api';

export default function LoginMedico() {
  const navigate = useNavigate();
  const [crm, setCrm] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/login/medico', { 
        crm, 
        senha 
      });
      
      const token = response.data.token;
      
      if (token) {
        localStorage.setItem('@HELENA:token', token);
        navigate('/painel-medico');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("CRM ou senha incorretos.");
        } else {
          alert("Erro na autenticação. Verifique suas credenciais e tente novamente.");
          console.error('Erro de resposta do servidor:', error.response.data);
        }
      } else {
        console.error('Erro de conexão:', error.message);
        alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
      }
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
          <div className="mb-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0b2b3f"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-1">
            Login do Médico
          </h2>
          <p className="text-[#6eb1be] text-lg font-medium">
            Acesse sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">
              CRM
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
              placeholder="Digite seu CRM..."
              value={crm}
              onChange={(e) => setCrm(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
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
            <Link
              to="/recuperar-senha"
              className="text-sm font-bold text-[#6eb1be] hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#6eb1be]/30"
          >
            Entrar
          </button>

          <p className="mt-8 text-center text-sm text-[#0b2b3f] font-medium pt-4">
            Não possui conta?{" "}
            <Link
              to="/cadastro-medico"
              className="text-[#6eb1be] hover:underline font-bold ml-1"
            >
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}