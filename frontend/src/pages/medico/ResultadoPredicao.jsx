import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle, FileText, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function ResultadoPredicao() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarResultado = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/predicoes/${id}`);
        setDados(response.data);
      } catch (err) {
        setError(err.response?.data?.erro || "Erro ao buscar a predição no banco.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) buscarResultado();
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/predicoes/${id}/pdf`, {
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
          <span className="ml-3 text-[#1a3c5a] font-bold text-xl">Carregando previsão...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 max-w-4xl font-medium">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </DashboardLayout>
    );
  }

  const isAltoRisco = dados?.resultado?.toLowerCase().includes("alto");
  const corRisco = isAltoRisco ? "text-red-600" : "text-green-600";

  const idDoPaciente = dados?.paciente_id || dados?.id_personalizado || (dados?.id ? `PRN-${String(dados.id).padStart(3, '0')}` : '-');

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Cabeçalho */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-[#1a3c5a] mb-2">Previsão</h2>
            <p className="text-[#6eb1be] text-lg">Visualize a previsão do paciente</p>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FileText className="text-red-500 h-5 w-5" fill="currentColor" />
            <span className="font-medium text-gray-700">predição.pdf</span>
            <span className="text-green-600 font-bold text-sm">2.4 MB</span>
          </button>
        </div>

        {/* Card: Dados Pessoais */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10">
          <h3 className="text-xl font-bold text-[#1a3c5a] mb-6 border-b border-gray-100 pb-4">
            Dados Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 mb-8">
            <div className="md:col-span-3">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Nome completo</label>
              <input readOnly value={dados?.paciente_nome || ''} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Data de nascimento</label>
              <input readOnly value={dados?.paciente_nasc || ''} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Id do paciente</label>
              <input readOnly value={idDoPaciente} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Médico</label>
              <input readOnly value={dados?.medico_nome || 'Dr. João Silva'} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Hospital</label>
              <input readOnly value={dados?.hospital_nome || ''} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Data da previsão</label>
              <input readOnly value={dados?.data || ''} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>

            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Probabilidade de risco</label>
              <input readOnly value={`${dados?.probabilidade || 0}%`} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[#1a3c5a] font-medium text-sm mb-2">Diagnóstico final</label>
              <input readOnly value={dados?.resultado || ''} className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none" />
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            <h4 className="text-[#1a3c5a] font-bold mb-2">Observações</h4>
            <p className="text-gray-500 text-sm">
              {dados?.observacoes || "Paciente apresenta sinais e sintomas sugestivos, recomendando-se investigação diagnóstica complementar."}
            </p>
          </div>
        </div>

        {/* Card: Formulário e Respostas */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 text-center border-b border-gray-200 pb-4 mb-2">
            <h3 className="text-xl font-bold text-[#1a3c5a]">Formulário</h3>
            <h3 className="text-xl font-bold text-[#1a3c5a]">Resposta</h3>
          </div>
          
          <div className="flex flex-col">
            {dados?.sintomas && Object.entries(dados.sintomas).map(([chave, valor], index) => (
              <div key={index} className="grid grid-cols-2 items-center py-4 border-b border-gray-100">
                <span className="text-[#1a3c5a] font-medium pr-4">{mapeamentoPerguntas[chave] || chave}</span>
                <span className="text-[#6eb1be] text-center font-medium">{formatarResposta(valor)}</span>
              </div>
            ))}
            
            {/* Linha de Resultado Final */}
            <div className="grid grid-cols-2 items-center py-5">
              <span className="text-xl font-bold text-[#1a3c5a]">Resultado Final</span>
              <span className={`text-center font-bold ${corRisco}`}>
                Com {dados?.probabilidade}% de risco, paciente apresenta {dados?.resultado?.toLowerCase()}.
              </span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}