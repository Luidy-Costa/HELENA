import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

export default function CadastroMedico() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Tentando cadastrar:", formData);
    // Futuramente: Integração com o /api/medicos do Flask
    
    // Simula sucesso e volta pro login
    alert("Cadastro realizado com sucesso!");
    navigate('/login-medico');
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

        {/* Títulos */}
        <div className="flex flex-col items-center mt-12 mb-6">
          <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-1">Novo Médico</h2>
          <p className="text-[#6eb1be] text-base font-medium">Crie sua conta no sistema LCP</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleCadastro} className="space-y-4">
          
          {/* Campo Nome */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input
              type="text"
              name="nome"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
              placeholder="Ex: Dr. João da Silva"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          {/* Grid para CRM e E-mail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">CRM</label>
              <input
                type="text"
                name="crm"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
                placeholder="123456-SP"
                value={formData.crm}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
                placeholder="medico@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Senha inicial</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#0b2b3f] hover:text-[#6eb1be] transition-colors"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Senha */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Confirmar senha</label>
            <div className="relative">
              <input
                type={mostrarConfirmar ? "text" : "password"}
                name="confirmarSenha"
                className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] focus:border-transparent outline-none text-[#0b2b3f] transition-all"
                placeholder="••••••••"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#0b2b3f] hover:text-[#6eb1be] transition-colors"
              >
                {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botão Cadastrar */}
          <button
            type="submit"
            className="w-full py-3.5 mt-4 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-[#6eb1be]/30"
          >
            Cadastrar Médico
          </button>

          {/* Link para Login */}
          <p className="mt-4 text-center text-sm text-[#0b2b3f] font-medium">
            Já possui conta? <Link to="/login-medico" className="text-[#6eb1be] hover:underline font-bold ml-1">Faça login</Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  );
}