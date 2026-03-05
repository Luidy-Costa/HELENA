import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function PerfilPaciente() {
  const navigate = useNavigate();

  // Estado para controlar se os inputs estão bloqueados ou liberados para edição
  const [isEditing, setIsEditing] = useState(false);

  // Dados do paciente (Mock)
  const [paciente, setPaciente] = useState({
    nome: 'Luisa da Silva',
    dataNascimento: '28/09/1970',
    idPaciente: 'PRN-2026-001'
  });

  // Histórico de previsões do paciente (Mock)
  const historico = [
    {
      id: 1,
      medico: 'Dr. João Silva',
      data: '03/01/2026',
      hospital: 'Hospital São Lucas',
      porcentagem: '70%',
      risco: 'Alto risco'
    },
    {
      id: 2,
      medico: 'Dr. João Silva',
      data: '03/01/2026',
      hospital: 'Hospital São Lucas',
      porcentagem: '60%',
      risco: 'Alto risco'
    }
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      // Se estava editando e clicou, significa que quer SALVAR
      console.log("Salvando novos dados:", paciente);
      // Futuramente: Chamada API para atualizar paciente (PUT /api/pacientes/<id>)
      alert("Informações atualizadas com sucesso!");
    }
    // Inverte o estado (de bloqueado para editável e vice-versa)
    setIsEditing(!isEditing);
  };

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/hospital-interna')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Pacientes
      </button>

      {/* Título da Página */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Perfil do Usuário</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Visualize as informações do paciente</p>
      </div>

      {/* =============== CAIXA 1: DADOS PESSOAIS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Nome */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input 
              type="text" 
              value={paciente.nome}
              onChange={(e) => setPaciente({...paciente, nome: e.target.value})}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be]' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-600'
              }`} 
            />
          </div>
          
          {/* Data Nasc */}
          <div>
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input 
              type="text" 
              value={paciente.dataNascimento}
              onChange={(e) => setPaciente({...paciente, dataNascimento: e.target.value})}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                isEditing 
                  ? 'border-[#6eb1be] bg-white focus:ring-2 focus:ring-[#6eb1be]' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-600'
              }`} 
            />
          </div>

          {/* ID (Sempre bloqueado, pois ID não muda) */}
          <div className="md:col-span-2 md:w-1/2 md:pr-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do paciente</label>
            <input 
              type="text" 
              value={paciente.idPaciente}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none cursor-not-allowed" 
            />
          </div>
        </div>

        {/* Botão Dinâmico (Editar / Salvar) */}
        <button 
          onClick={handleEditToggle}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-md ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-[#6eb1be] hover:bg-[#5ca0ad] text-white'
          }`}
        >
          {isEditing ? <Save size={18} /> : <Edit size={18} />}
          {isEditing ? 'Salvar Informações' : 'Editar Informações'}
        </button>
      </div>

      {/* =============== CAIXA 2: HISTÓRICO DE PREVISÕES =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">Histórico de previsões do paciente</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-[#0b2b3f]">Médico</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Data da Previsão</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Hospital</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Porcentagem</th>
                <th className="py-4 font-bold text-[#0b2b3f]">Grau de Risco</th>
                <th className="py-4 font-bold text-[#0b2b3f]"></th> {/* Coluna vazia pro botão */}
              </tr>
            </thead>
            <tbody>
              {historico.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 text-gray-600 font-medium">{item.medico}</td>
                  <td className="py-5 text-gray-600 font-medium">{item.data}</td>
                  <td className="py-5 text-gray-600 font-medium">{item.hospital}</td>
                  <td className="py-5 text-gray-600 font-medium">{item.porcentagem}</td>
                  <td className="py-5 text-gray-600 font-medium">{item.risco}</td>
                  <td className="py-5 text-right">
                    <button 
                      onClick={() => navigate('/resultado-predicao')} // Rota para ver o laudo completo
                      className="px-6 py-2 border-2 border-[#6eb1be] text-[#0b2b3f] font-bold text-sm rounded-full hover:bg-[#6eb1be] hover:text-white transition-colors"
                    >
                      Saiba mais
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </DashboardLayout>
  );
}