import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Building2 } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";

export default function LoginHospital() {
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Simulando login hospitalar:", { cnpj });
    
    // Simula sucesso e joga pro painel logado
    navigate('/painel-hospital');
  };

  return (
    <AuthLayout>
      <div className="relative w-full">
        
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/')}
          className="absolute -top-6 -left-4 flex items-center gap-2 px-4 py-2 bg-[#6eb1be] text-white rounded-lg hover:bg-[#5ca0ad] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Ícone e Títulos */}
        <div className="flex flex-col items-center mt-12 mb-8">
          <div className="mb-4 text-[#0b2b3f]">
            <Building2 size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-1 text-center">
            Login do Administrador Hospitalar
          </h2>
          <p className="text-[#6eb1be] text-lg font-medium">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo CNPJ */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">CNPJ</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
              placeholder="Digite seu e-mail ou CNPJ..."
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Senha</label>
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
            <Link to="/cadastro-hospital" className="text-[#6eb1be] hover:underline font-bold ml-1">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}