import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

export default function CadastroHospital() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
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

    console.log("Simulando cadastro hospital:", formData);
    alert("Hospital cadastrado com sucesso! (Modo Simulação)");
    navigate('/login-hospital');
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

        <div className="flex flex-col items-center mt-6 mb-6">
          <h2 className="text-[32px] font-bold text-[#0b2b3f] mb-1">Adicionar Novo Hospital</h2>
          <p className="text-[#6eb1be] text-base font-medium">Cadastre um hospital no sistema LCP</p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-4">
          
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome do Hospital</label>
            <input
              type="text"
              name="nome"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
              placeholder="Ex: Hospital São Lucas"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">CNPJ</label>
            <input
              type="text"
              name="cnpj"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
              placeholder="00.000.000/0000-00"
              value={formData.cnpj}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] transition-all"
              placeholder="hospital@exemplo.com.br"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Este e-mail será usado para recuperação de senha</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Senha inicial</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#0b2b3f]"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Confirmar senha</label>
              <div className="relative">
                <input
                  type={mostrarConfirmar ? "text" : "password"}
                  name="confirmarSenha"
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                  placeholder="••••••••"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#0b2b3f]"
                >
                  {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 py-3 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white rounded-full font-bold transition-colors">
              Cadastrar Hospital
            </button>
            <button type="button" onClick={() => navigate('/')} className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-full font-bold hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </form>

      </div>
    </AuthLayout>
  );
}