import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Building2, User } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";

export default function LoginSelecao() {
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const navigate = useNavigate();

  const handleEntrar = () => {
    if (tipoSelecionado === "medico") {
      navigate("/login-medico"); // Vai para a tela de login do médico
    } else if (tipoSelecionado === "hospital") {
      console.log("Navegar para admin hospitalar");
    } else if (tipoSelecionado === "admin") {
      console.log("Navegar para admin geral");
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-10">
        <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-2">
          Seja bem-vindo!
        </h2>
        <p className="text-[#6eb1be] text-lg font-medium">
          Acesse sua conta para continuar
        </p>
      </div>

      <div>
        <label className="block text-[#0b2b3f] font-bold mb-4 text-center">
          Tipo de acesso
        </label>

        {/* Botões de Seleção */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setTipoSelecionado("medico")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              tipoSelecionado === "medico"
                ? "border-[#0b2b3f] text-[#0b2b3f] bg-white shadow-md"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <Stethoscope size={32} className="mb-2" />
            <span className="text-xs font-semibold">Médico</span>
          </button>

          <button
            type="button"
            onClick={() => setTipoSelecionado("hospital")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              tipoSelecionado === "hospital"
                ? "border-[#0b2b3f] text-[#0b2b3f] bg-white shadow-md"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <Building2 size={32} className="mb-2" />
            <span className="text-xs font-semibold text-center">
              Admin Hospitalar
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTipoSelecionado("admin")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              tipoSelecionado === "admin"
                ? "border-[#0b2b3f] text-[#0b2b3f] bg-white shadow-md"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            <User size={32} className="mb-2" />
            <span className="text-xs font-semibold text-center">
              Admin Geral
            </span>
          </button>
        </div>

        {/* Botão de Entrar */}
        <button
          onClick={handleEntrar}
          disabled={!tipoSelecionado}
          className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-colors ${
            tipoSelecionado
              ? "bg-[#6eb1be] hover:bg-[#5ca0ad] text-white shadow-lg cursor-pointer"
              : "bg-[#6eb1be]/50 text-white cursor-not-allowed"
          }`}
        >
          Entrar
        </button>
      </div>
    </AuthLayout>
  );
}
