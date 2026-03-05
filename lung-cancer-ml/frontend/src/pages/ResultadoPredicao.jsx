import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function ResultadoPredicao() {
  const navigate = useNavigate();

  // Dados falsos (Mock) simulando o retorno da Inteligência Artificial do Backend
  const laudo = {
    paciente: {
      nome: 'Ex: Luisa da Silva',
      dataNascimento: '28/09/1970',
      idPaciente: 'PRN-2026-001',
      medico: 'João Silva',
      hospital: 'São Lucas',
      dataPrevisao: '03/01/2026'
    },
    resultado: {
      probabilidade: '70%',
      diagnostico: 'Alto risco',
      observacoes: 'Paciente apresenta sinais e sintomas sugestivos de neoplasia pulmonar, recomendando-se investigação diagnóstica complementar.'
    },
    respostas: [
      { pergunta: 'Qual a faixa etária do paciente?', resposta: '50 a 70' },
      { pergunta: 'Qual o gênero do paciente?', resposta: 'feminino' },
      { pergunta: 'Qual o histórico de tabagismo?', resposta: 'fumante' },
      { pergunta: 'Possui histórico de alcoolismo?', resposta: 'sim' },
      { pergunta: 'Frequência Respiratória:', resposta: 'anormal' },
      { pergunta: 'Frequência Cardíaca:', resposta: 'anormal' },
      { pergunta: 'Pressão Sistólica:', resposta: 'normal' },
      { pergunta: 'Pressão Diastólica:', resposta: 'normal' },
      { pergunta: 'Saturação de Oxigênio (SpO2):', resposta: 'normal' },
      { pergunta: 'Índice de Massa Corporal (IMC):', resposta: 'anormal' },
      { pergunta: 'O paciente apresenta Falta de Ar?', resposta: 'sim' },
      { pergunta: 'O paciente apresenta Tosse persistente?', resposta: 'sim' },
      { pergunta: 'O paciente apresenta Tosse com Sangue (Hemoptise)?', resposta: 'sim' },
      { pergunta: 'O paciente relata Fadiga (cansaço extremo)?', resposta: 'sim' },
      { pergunta: 'O paciente apresenta Chiado no peito?', resposta: 'não' }
    ]
  };

  const handleDownloadPDF = () => {
    // Futuramente: Chamará a rota /api/predicoes/<id>/pdf
    alert("Iniciando download do laudo em PDF...");
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

      {/* Cabeçalho: Título e Botão PDF */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Previsão</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visualize a previsão do paciente</p>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow text-[#0b2b3f] px-6 py-2.5 rounded-full font-bold transition-all"
        >
          <FileText size={20} className="text-red-500" />
          <span>predição.pdf</span>
          <span className="text-green-600 ml-1">2.4 MB</span>
        </button>
      </div>

      {/* =============== CAIXA 1: DADOS PESSOAIS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Nome e Data Nasc */}
          <div className="md:col-span-8">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input type="text" readOnly value={laudo.paciente.nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input type="text" readOnly value={laudo.paciente.dataNascimento} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
          </div>

          {/* ID, Medico, Hospital e Data */}
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do paciente</label>
            <input type="text" readOnly value={laudo.paciente.idPaciente} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Médico</label>
            <input type="text" readOnly value={laudo.paciente.medico} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Hospital</label>
            <input type="text" readOnly value={laudo.paciente.hospital} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data da previsão</label>
            <input type="text" readOnly value={laudo.paciente.dataPrevisao} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none" />
          </div>

          {/* Risco e Diagnostico */}
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Probabilidade de risco</label>
            <input type="text" readOnly value={laudo.resultado.probabilidade} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 outline-none font-bold" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Diagnóstico final</label>
            <input type="text" readOnly value={laudo.resultado.diagnostico} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-red-500 font-bold outline-none" />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Observações</label>
          <div className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-600 min-h-[80px]">
            {laudo.resultado.observacoes}
          </div>
        </div>
      </div>

      {/* =============== CAIXA 2: TABELA DE RESPOSTAS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-6 px-8 font-bold text-[#0b2b3f] text-lg text-center w-1/2">Formulário</th>
              <th className="py-6 px-8 font-bold text-[#0b2b3f] text-lg text-center w-1/2">Resposta</th>
            </tr>
          </thead>
          <tbody>
            {laudo.respostas.map((item, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="py-4 px-8 text-[#0b2b3f] font-bold text-sm border-r border-gray-100">{item.pergunta}</td>
                <td className="py-4 px-8 text-[#6eb1be] font-medium text-sm text-center">{item.resposta}</td>
              </tr>
            ))}
            {/* Linha de Resultado Final Destacada */}
            <tr className="border-t-2 border-gray-200 bg-gray-50/30">
              <td className="py-6 px-8 text-[#0b2b3f] font-bold text-lg border-r border-gray-100">Resultado Final</td>
              <td className="py-6 px-8 text-red-600 font-bold text-center">
                Com {laudo.resultado.probabilidade} de risco, paciente apresenta {laudo.resultado.diagnostico.toLowerCase()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </DashboardLayout>
  );
}