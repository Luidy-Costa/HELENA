import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

export default function ResultadoPredicao() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Pega o ID da predição que foi passado pela tela do Formulário (ou pelo Histórico)
  const id_predicao = location.state?.id_predicao;

  // 2. Estado para guardar os dados reais que virão do Flask
  const [laudo, setLaudo] = useState(null);
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  // 3. Busca os dados no momento em que a tela abre
  useEffect(() => {
    if (!id_predicao) {
      alert("Nenhuma predição selecionada.");
      navigate('/painel-medico');
      return;
    }

    const carregarResultado = async () => {
      try {
        const response = await api.get(`/predicoes/${id_predicao}`);
        setLaudo(response.data);
      } catch (error) {
        console.error("Erro ao carregar predição:", error);
        alert("Erro ao carregar os dados do resultado.");
      }
    };

    carregarResultado();
  }, [id_predicao, navigate]);

  // 4. Função para baixar o PDF gerado pelo Python
  const handleBaixarPdf = async () => {
    setBaixandoPdf(true);
    try {
      const response = await api.get(`/predicoes/${id_predicao}/pdf`, {
        responseType: 'blob', // IMPORTANTÍSSIMO: Diz ao Axios que estamos recebendo um arquivo, não JSON
      });

      // Cria um link temporário no navegador para forçar o download do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laudo_LCP_${laudo.paciente_nome.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Verifique o servidor.");
    } finally {
      setBaixandoPdf(false);
    }
  };

  // Enquanto não carrega os dados do Flask, mostra uma tela em branco (ou spinner)
  if (!laudo) return <DashboardLayout><div className="p-8 font-bold text-[#6eb1be]">Carregando resultado da IA...</div></DashboardLayout>;

  // Função para formatar o JSON de sintomas do banco para a tabela do React
  const formatarSintomas = (sintomasObj) => {
    if (!sintomasObj) return [];
    let obj = typeof sintomasObj === 'string' ? JSON.parse(sintomasObj) : sintomasObj;
    
    return Object.entries(obj).map(([key, value]) => {
      const pergunta = key.replace(/_/g, ' '); // Tira os underlines
      let resposta = value;
      // Ajuste visual para os 1 e 0 do banco
      if (value === 1) resposta = "Sim / Anormal";
      if (value === 0) resposta = "Não / Normal";
      return { pergunta, resposta };
    });
  };

  const isAltoRisco = laudo.resultado === "Alto Risco";

  return (
    <DashboardLayout>
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/painel-medico')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={18} /> Voltar para o painel
      </button>

      {/* Título da Página */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Resultado da Avaliação</h2>
          <p className="text-[#6eb1be] text-lg font-medium">Laudo gerado pela Inteligência Artificial</p>
        </div>

        {/* BOTÃO GERAR PDF */}
        <button 
          onClick={handleBaixarPdf}
          disabled={baixandoPdf}
          className="flex items-center gap-2 bg-[#0b2b3f] hover:bg-[#1a425e] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
        >
          {baixandoPdf ? "Gerando Laudo..." : <><Download size={20} /> Baixar Laudo em PDF</>}
        </button>
      </div>

      {/* =============== CAIXA 1: CABEÇALHO DO LAUDO =============== */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 max-w-4xl mx-auto">
        
        {/* Info do Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Paciente</p>
            <p className="text-[#0b2b3f] font-bold text-lg">{laudo.paciente_nome}</p>
            <p className="text-gray-500 font-medium text-sm">Nasc: {new Date(laudo.paciente_nasc).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Detalhes do Atendimento</p>
            <p className="text-[#0b2b3f] font-bold">Médico: {laudo.medico_nome}</p>
            <p className="text-gray-500 font-medium text-sm">Hospital: {laudo.hospital_nome}</p>
            <p className="text-gray-500 font-medium text-sm">Data da avaliação: {new Date(laudo.data).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Diagnóstico da IA (Dinâmico com base na probabilidade) */}
        <div className={`p-8 rounded-xl border ${isAltoRisco ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} text-center`}>
          <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${isAltoRisco ? 'text-red-600' : 'text-green-600'}`}>
            Diagnóstico Preditivo
          </p>
          <h3 className={`text-4xl font-black mb-2 ${isAltoRisco ? 'text-red-700' : 'text-green-700'}`}>
            {laudo.resultado}
          </h3>
          <div className="inline-flex items-center justify-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mt-4">
            <span className="text-gray-500 font-medium">Probabilidade Calculada:</span>
            <span className="text-[#0b2b3f] font-black text-xl">{laudo.probabilidade}%</span>
          </div>
        </div>
      </div>

      {/* =============== CAIXA 2: TABELA DE RESPOSTAS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto mb-10">
        <div className="bg-[#f4f9fb] py-4 px-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#0b2b3f] flex items-center gap-2">
            <FileText size={20} className="text-[#6eb1be]"/> Sinais Clínicos Analisados
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-8 font-bold text-[#0b2b3f] text-sm uppercase bg-gray-50 border-b border-gray-100 w-1/2">Parâmetro</th>
              <th className="py-4 px-8 font-bold text-[#0b2b3f] text-sm uppercase bg-gray-50 border-b border-gray-100 w-1/2">Valor Inserido</th>
            </tr>
          </thead>
          <tbody>
            {formatarSintomas(laudo.sintomas).map((item, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-4 px-8 text-[#0b2b3f] font-bold text-sm">{item.pergunta}</td>
                <td className="py-4 px-8 text-[#6eb1be] font-bold text-sm">{item.resposta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </DashboardLayout>
  );
}