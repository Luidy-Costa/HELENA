import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Mail, ImagePlus, UserPlus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PerfilAdmin() {
  const navigate = useNavigate();
  
  // Estados do Perfil Atual
  const [perfilData, setPerfilData] = useState({ nome: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [mensagemPerfil, setMensagemPerfil] = useState({ tipo: '', texto: '' });

  // Estados para Novo Admin
  const [exibirFormNovoAdmin, setExibirFormNovoAdmin] = useState(false);
  const [novoAdmin, setNovoAdmin] = useState({ nome_completo: '', email: '', senha: '' });
  const [savingNovoAdmin, setSavingNovoAdmin] = useState(false);
  const [mensagemNovoAdmin, setMensagemNovoAdmin] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await api.get('/perfil');
        setPerfilData({
          nome: response.data.nome || '',
          email: response.data.email || ''
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, []);

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    setSavingPerfil(true);
    setMensagemPerfil({ tipo: '', texto: '' });
    try {
      await api.put('/perfil', perfilData);
      setMensagemPerfil({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMensagemPerfil({ tipo: 'erro', texto: error.response?.data?.erro || 'Erro ao atualizar perfil.' });
    } finally {
      setSavingPerfil(false);
    }
  };

  const handleCadastrarNovoAdmin = async (e) => {
    e.preventDefault();
    setSavingNovoAdmin(true);
    setMensagemNovoAdmin({ tipo: '', texto: '' });
    
    try {
      await api.post('/admin/novo', novoAdmin);
      setMensagemNovoAdmin({ tipo: 'sucesso', texto: 'Novo Administrador cadastrado com sucesso!' });
      setNovoAdmin({ nome_completo: '', email: '', senha: '' }); // Limpa o formulário
      setTimeout(() => setExibirFormNovoAdmin(false), 2000);
    } catch (error) {
      setMensagemNovoAdmin({ tipo: 'erro', texto: error.response?.data?.erro || 'Erro ao cadastrar administrador.' });
    } finally {
      setSavingNovoAdmin(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-[#6eb1be]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <button  
          onClick={() => navigate('/painel-admin')}  
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm" 
        > 
          <ArrowLeft size={16} /> Voltar para o Painel
        </button> 

        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Super Admin</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visualize seu perfil e Cadastre um novo admin</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          
          {/* SESSÃO 1: MEU PERFIL */}
          <h3 className="text-xl font-bold text-[#0b2b3f] mb-8 border-b border-gray-100 pb-4">
            Dados do Administrador
          </h3>

          {mensagemPerfil.texto && (
            <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 font-medium ${mensagemPerfil.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {mensagemPerfil.tipo === 'sucesso' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{mensagemPerfil.texto}</span>
            </div>
          )}

          <form onSubmit={handleSalvarPerfil} className="flex flex-col md:flex-row gap-10 mb-12">
            <div className="flex flex-col items-start shrink-0">
              <label className="block text-[#0b2b3f] font-bold text-sm mb-3">Adicionar foto de perfil</label>
              <div className="w-40 h-40 rounded-2xl border-2 border-[#6eb1be] flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors mb-2">
                <ImagePlus size={48} className="text-[#6eb1be]" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-gray-400">Imagem do Admin</span>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Nome do Admin</label>
                <input
                  type="text"
                  value={perfilData.nome}
                  onChange={(e) => setPerfilData({...perfilData, nome: e.target.value})}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[#0b2b3f] font-bold text-sm mb-2">
                  <Mail size={16} /> E-mail
                </label>
                <input
                  type="email"
                  value={perfilData.email}
                  onChange={(e) => setPerfilData({...perfilData, email: e.target.value})}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-gray-600 transition-all"
                  required
                />
                <p className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">
                  Este e-mail será usado para recuperação de senha
                </p>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={savingPerfil}
                  className="flex items-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50"
                >
                  {savingPerfil ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Salvar alterações
                </button>
              </div>
            </div>
          </form>

          {/* SESSÃO 2: CADASTRAR NOVO ADMIN */}
          <h3 className="text-xl font-bold text-[#0b2b3f] mb-8 border-b border-gray-100 pb-4 pt-6">
            Cadastrar Novo Admin
          </h3>

          {mensagemNovoAdmin.texto && (
            <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 font-medium ${mensagemNovoAdmin.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {mensagemNovoAdmin.tipo === 'sucesso' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{mensagemNovoAdmin.texto}</span>
            </div>
          )}

          {!exibirFormNovoAdmin ? (
            <div className="flex gap-4">
              <button 
                onClick={() => setExibirFormNovoAdmin(true)}
                className="flex items-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white font-bold px-8 py-3 rounded-full transition-all"
              >
                <Save className="h-5 w-5" />
                Cadastrar Admin
              </button>
              <button 
                className="px-8 py-3 border-2 border-gray-200 text-gray-500 rounded-full font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <form onSubmit={handleCadastrarNovoAdmin} className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={novoAdmin.nome_completo}
                    onChange={(e) => setNovoAdmin({...novoAdmin, nome_completo: e.target.value})}
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#0b2b3f] font-bold text-sm mb-2">E-mail</label>
                  <input
                    type="email"
                    value={novoAdmin.email}
                    onChange={(e) => setNovoAdmin({...novoAdmin, email: e.target.value})}
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Senha Temporária</label>
                  <input
                    type="password"
                    value={novoAdmin.senha}
                    onChange={(e) => setNovoAdmin({...novoAdmin, senha: e.target.value})}
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={savingNovoAdmin}
                  className="flex items-center gap-2 bg-[#0b2b3f] hover:bg-[#1a425e] text-white font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50"
                >
                  {savingNovoAdmin ? <RefreshCw className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                  Confirmar Cadastro
                </button>
                <button 
                  type="button"
                  onClick={() => setExibirFormNovoAdmin(false)}
                  className="px-8 py-3 border-2 border-gray-200 text-gray-500 rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}