import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function CadastroHospitalAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      await api.post('/hospitais', {
        nome_fantasia: formData.nome,
        nome: formData.nome, 
        cnpj: formData.cnpj,
        email: formData.email,
        senha: formData.senha
      });
      
      setMensagem({ tipo: 'sucesso', texto: 'Hospital cadastrado com sucesso! Redirecionando...' });
      setTimeout(() => navigate('/painel-admin'), 2000);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.response?.data?.erro || 'Erro ao cadastrar o hospital.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        
        <button  
          onClick={() => navigate('/painel-admin')}  
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm" 
        > 
          <ArrowLeft size={16} /> Voltar para o Painel
        </button> 

        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Cadastrar Nova Instituição</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Adicione um novo hospital à rede do sistema</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="bg-[#f4f9fb] p-3 rounded-xl text-[#0b2b3f]">
              <Building2 size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0b2b3f]">Dados Cadastrais</h3>
              <p className="text-gray-500 text-sm font-medium">Preencha as informações para liberar o acesso</p>
            </div>
          </div>

          {mensagem.texto && (
            <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 font-medium ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {mensagem.tipo === 'sucesso' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{mensagem.texto}</span>
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Hospital São Lucas"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">E-mail Administrativo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@hospital.com.br"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Senha Temporária</label>
                <input
                  type="text"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Defina uma senha inicial para a instituição..."
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  A instituição poderá alterar esta senha posteriormente utilizando a função de "Esqueci minha senha".
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white font-bold px-8 py-3.5 rounded-full transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {loading ? "Registrando..." : "Cadastrar Instituição"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </DashboardLayout>
  );
}