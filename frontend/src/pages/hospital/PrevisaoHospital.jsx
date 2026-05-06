import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function PrevisaoHospital() {
  const navigate = useNavigate();
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  // Dados simulados baseados no seu design "visualizar previsão.png"
  const laudo = {
    id: 'PRN-2026-001',
    paciente_nome: 'Luisa da Silva',
    paciente_nasc: '1970-09-28',
    medico_nome: 'Dr. João Silva',
    hospital_nome: 'Hospital São Lucas',
    data_previsao: '2026-01-03',
    probabilidade: 70,
    resultado: 'Alto risco',
    observacoes: 'Paciente apresenta sinais e sintomas sugestivos de neoplasia pulmonar, recomendando-se investigação diagnóstica complementar.'
  };

  // Respostas simuladas do formulário
  const respostas = [
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
  ];

  const isAltoRisco = laudo.resultado.toLowerCase() === "alto risco";

  const handleDownloadPDF = () => {
    setBaixandoPdf(true);
    setTimeout(() => {
      alert("Simulando o download do PDF do Laudo!");
      setBaixandoPdf(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/perfil-paciente-hospital')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Perfil
      </button>

      {/* Cabeçalho: Título e Botão PDF */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Previsão</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Visualize a previsão do paciente</p>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          disabled={baixandoPdf}
          className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow text-[#0b2b3f] px-6 py-2.5 rounded-full font-bold transition-all disabled:opacity-50"
        >
          <FileText size={20} className="text-red-500" />
          <span>{baixandoPdf ? "Gerando..." : "predição.pdf"}</span>
          <span className="text-green-500 font-bold ml-2">2.4 MB</span>
        </button>
      </div>

      {/* =============== CAIXA 1: DADOS PESSOAIS E OBSERVAÇÕES =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Linha 1 */}
          <div className="md:col-span-8">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input type="text" readOnly value={laudo.paciente_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input type="text" readOnly value={new Date(laudo.paciente_nasc + "T00:00:00").toLocaleDateString('pt-BR')} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>

          {/* Linha 2 */}
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do paciente</label>
            <input type="text" readOnly value={laudo.id} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Médico</label>
            <input type="text" readOnly value={laudo.medico_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Hospital</label>
            <input type="text" readOnly value={laudo.hospital_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data da previsão</label>
            <input type="text" readOnly value={new Date(laudo.data_previsao + "T00:00:00").toLocaleDateString('pt-BR')} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>

          {/* Linha 3 */}
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Probabilidade de risco</label>
            <input type="text" readOnly value={`${laudo.probabilidade}%`} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] outline-none font-bold" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Diagnóstico final</label>
            <input type="text" readOnly value={laudo.resultado} className={`w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 font-bold outline-none capitalize ${isAltoRisco ? 'text-red-500' : 'text-green-600'}`} />
          </div>
        </div>

        {/* Quadro de Observações adicionado conforme o Design */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Observações</label>
          <p className="text-gray-600 text-sm leading-relaxed">{laudo.observacoes}</p>
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
            {respostas.map((item, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/50">
                <td className="py-4 px-8 text-[#0b2b3f] font-bold text-sm border-r border-gray-100">{item.pergunta}</td>
                <td className="py-4 px-8 text-[#6eb1be] font-bold text-sm text-center lowercase">{item.resposta}</td>
              </tr>
            ))}
            {/* Linha de Resultado Final Destacada */}
            <tr className="border-t-2 border-gray-200 bg-gray-50/30">
              <td className="py-6 px-8 text-[#0b2b3f] font-bold text-lg border-r border-gray-100">Resultado Final</td>
              <td className={`py-6 px-8 font-bold text-center ${isAltoRisco ? 'text-red-600' : 'text-green-600'}`}>
                Com {laudo.probabilidade}% de risco, paciente apresenta {laudo.resultado.toLowerCase()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </DashboardLayout>
  );
}