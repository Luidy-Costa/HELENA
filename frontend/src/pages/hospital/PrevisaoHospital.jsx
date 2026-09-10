import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function PrevisaoHospital() {
  const navigate = useNavigate();
  const location = useLocation();
  const predicaoId = location.state?.id;
  const pacienteId = location.state?.pacienteId;

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  useEffect(() => {
    if (!predicaoId) {
      navigate('/historico-pacientes-hospital');
      return;
    }

    const buscarResultado = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/predicoes/${predicaoId}`);
        setDados(response.data);
      } catch (err) {
        setError(err.response?.data?.erro || "Erro ao buscar a predição no banco.");
      } finally {
        setLoading(false);
      }
    };
    
    buscarResultado();
  }, [predicaoId, navigate]);

  const handleDownloadPDF = async () => {
    try {
      setBaixandoPdf(true);
      const response = await api.get(`/predicoes/${predicaoId}/pdf`, {
        responseType: 'blob', 
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `predicao_${dados?.paciente_nome?.replace(/\s/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Erro ao tentar baixar o laudo PDF.");
    } finally {
      setBaixandoPdf(false);
    }
  };

  const mapeamentoPerguntas = {
    Idade: "Qual a faixa etária do paciente?",
    Genero: "Qual o gênero do paciente?",
    Fumo: "Qual o histórico de tabagismo?",
    Alcoolismo: "Possui histórico de alcoolismo?",
    Freq_Respiratoria: "Frequência Respiratória:",
    Freq_Cardiaca: "Frequência Cardíaca:",
    Pressao_Sistolica: "Pressão Sistólica:",
    Pressao_Diastolica: "Pressão Diastólica:",
    Sat_Oxigenio: "Saturação de Oxigênio (SpO2):",
    IMC: "Índice de Massa Corporal (IMC):",
    Falta_Ar: "O paciente apresenta Falta de Ar?",
    Tosse: "O paciente apresenta Tosse persistente?",
    Tosse_Sangue: "O paciente apresenta Tosse com Sangue (Hemoptise)?",
    Fadiga: "O paciente relata Fadiga (cansaço extremo)?",
    Chiado: "O paciente apresenta Chiado no peito?"
  };

  const formatarResposta = (valor) => {
    if (!valor && valor !== 0) return '-';
    let formatado = valor.toString().toLowerCase().replace(/_/g, ' ');
    if (formatado === 'm') return 'masculino';
    if (formatado === 'f') return 'feminino';
    return formatado;
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

  if (error || !dados) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 max-w-4xl font-medium">
          <AlertCircle className="h-5 w-5" />
          <span>{error || "Erro ao carregar a predição."}</span>
        </div>
      </DashboardLayout>
    );
  }

  const isAltoRisco = dados?.resultado?.toLowerCase().includes("alto");
  const corRisco = isAltoRisco ? "text-red-600" : "text-green-600";
  const idDoPaciente = dados?.paciente_id || dados?.id_personalizado || (dados?.id ? `${dados.id}` : '-');

  return (
    <DashboardLayout>
      <button 
        onClick={() => navigate('/perfil-paciente-hospital', { state: { id: pacienteId } })}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar para o Perfil
      </button>

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
          {baixandoPdf ? <RefreshCw className="animate-spin text-[#6eb1be] h-5 w-5" /> : <FileText size={20} className="text-red-500" />}
          <span>{baixandoPdf ? "Gerando..." : "predição.pdf"}</span>
        </button>
      </div>

      {/* =============== CAIXA 1: DADOS PESSOAIS E OBSERVAÇÕES =============== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-[#0b2b3f] mb-6">Dados Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-8">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome completo</label>
            <input type="text" readOnly value={dados.paciente_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
            <input type="text" readOnly value={dados.paciente_nasc} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Id do paciente</label>
            <input type="text" readOnly value={idDoPaciente} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Médico</label>
            <input type="text" readOnly value={dados.medico_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Hospital</label>
            <input type="text" readOnly value={dados.hospital_nome} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data da previsão</label>
            <input type="text" readOnly value={dados.data} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] font-medium outline-none" />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Probabilidade de risco</label>
            <input type="text" readOnly value={`${dados.probabilidade}%`} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-[#0b2b3f] outline-none font-bold" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Diagnóstico final</label>
            <input type="text" readOnly value={dados.resultado} className={`w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 font-bold outline-none capitalize ${isAltoRisco ? 'text-red-500' : 'text-green-600'}`} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <label className="block text-[#0b2b3f] font-bold text-sm mb-2">Observações</label>
          <p className="text-gray-600 text-sm leading-relaxed">
            {dados.observacoes || "Paciente avaliado. Acompanhamento padrão recomendado."}
          </p>
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
            {dados.sintomas && Object.entries(dados.sintomas).map(([chave, valor], index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/50">
                <td className="py-4 px-8 text-[#0b2b3f] font-bold text-sm border-r border-gray-100">{mapeamentoPerguntas[chave] || chave}</td>
                <td className="py-4 px-8 text-[#6eb1be] font-bold text-sm text-center lowercase">{formatarResposta(valor)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-200 bg-gray-50/30">
              <td className="py-6 px-8 text-[#0b2b3f] font-bold text-lg border-r border-gray-100">Resultado Final</td>
              <td className={`py-6 px-8 font-bold text-center ${isAltoRisco ? 'text-red-600' : 'text-green-600'}`}>
                Com {dados.probabilidade}% de risco, paciente apresenta {dados.resultado.toLowerCase()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}