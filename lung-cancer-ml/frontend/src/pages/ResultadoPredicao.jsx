import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api'; // MENSAGEIRO

export default function ResultadoPredicao() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Pega a variável que veio na bagagem e garante que vamos extrair apenas o número
  let id_cru = location.state?.id_predicao;
  let id_predicao = id_cru;

  if (typeof id_cru === 'object' && id_cru !== null) {
    id_predicao = id_cru.predicao_id || id_cru.id || id_cru.data;
  }

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
        navigate('/painel-medico'); 
      }
    };

    carregarResultado();
  }, [id_predicao, navigate]);

  // 4. Função para baixar o PDF gerado pelo Python
  const handleDownloadPDF = async () => {
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

  const respostasReais = formatarSintomas(laudo.sintomas);
  const isAltoRisco = laudo.resultado === "Alto Risco";

  return (
    <DashboardLayout>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate('/painel-medico')}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Painel
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
          className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow text-[#0b2b3f] px-6 py-2.5 rounded-full font-bold transition-all disabled:opacity-50"
        >
          <FileText size={20} className="text-red-500" />
          <span>{baixandoPdf ? "Gerando..." : "predição.pdf"}</span>
          <span className="text-green-600 ml-1">↓</span>
        </button>
      </div>

      {/* =============== CAIXA 1: DADOS PESSOAIS =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Nome e Data Nasc */}
          <div className="md:col-span-8">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input type="text" readOnly value={laudo.paciente_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input type="text" readOnly value={new Date(laudo.paciente_nasc).toLocaleDateString('pt-BR')} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] font-medium outline-none" />
          </div>

          {/* ID, Medico, Hospital e Data */}
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do atendimento</label>
            <input type="text" readOnly value={`#${laudo.id}`} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Médico</label>
            <input type="text" readOnly value={laudo.medico_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Hospital</label>
            <input type="text" readOnly value={laudo.hospital_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data da previsão</label>
            <input type="text" readOnly value={new Date(laudo.data).toLocaleDateString('pt-BR')} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] font-medium outline-none" />
          </div>

          {/* Risco e Diagnostico */}
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Probabilidade de risco</label>
            <input type="text" readOnly value={`${laudo.probabilidade}%`} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-[#0b2b3f] outline-none font-bold" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Diagnóstico final</label>
            <input type="text" readOnly value={laudo.resultado} className={`w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 font-bold outline-none ${isAltoRisco ? 'text-red-500' : 'text-green-600'}`} />
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
            {respostasReais.map((item, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/50">
                <td className="py-4 px-8 text-[#0b2b3f] font-bold text-sm border-r border-gray-100 capitalize">{item.pergunta}</td>
                <td className="py-4 px-8 text-[#6eb1be] font-bold text-sm text-center uppercase">{item.resposta}</td>
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