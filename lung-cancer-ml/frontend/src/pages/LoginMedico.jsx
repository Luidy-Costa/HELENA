import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";

export default function LoginMedico() {
  const navigate = useNavigate();
  const [crm, setCrm] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Tentando logar:", { crm, senha });
    // Futuramente: Integração com o /api/login/medico do Flask
  };

  return (
    <AuthLayout>
      <div className="relative w-full">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-6 -left-4 flex items-center gap-2 px-4 py-2 bg-[#6eb1be] text-white rounded-lg hover:bg-[#5ca0ad] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Ícone e Títulos (Fiel ao Figma) */}
        <div className="flex flex-col items-center mt-12 mb-8">
          {/* Ícone imitando o design */}
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

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo CRM */}
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

          {/* Campo Senha */}
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

          {/* Esqueceu a senha */}
          <div className="flex justify-start">
            <Link
              to="/recuperar-senha"
              className="text-sm font-bold text-[#6eb1be] hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#6eb1be]/30"
          >
            Entrar
          </button>

          {/* Link de Cadastro */}
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
