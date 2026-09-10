import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

export default function FormularioPredicao() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital;

  const [paciente, setPaciente] = useState({
    nome: '',
    dataNascimento: '',
    id: '' 
  });

  const [form, setForm] = useState({
    idade: '', genero: '', fumo: '', alcoolismo: '',
    freqRespiratoria: '', freqCardiaca: '', pressaoSistolica: '',
    pressaoDiastolica: '', satOxigenio: '', imc: '',
    faltaAr: '', tosse: '', tosseSangue: '', fadiga: '', chiado: ''
  });

  const [observacoes, setObservacoes] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleDataChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 8) value = value.slice(0, 8); 

    if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    }

    setPaciente({ ...paciente, dataNascimento: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hospital) {
      alert("Erro: Nenhum hospital selecionado. Volte e acesse o hospital novamente.");
      return;
    }

    if (!paciente.nome.trim() || paciente.dataNascimento.length !== 10) {
      alert("Atenção: O Nome e a Data de Nascimento (completa) são obrigatórios!");
      return;
    }

    setCarregando(true);

    const [dia, mes, ano] = paciente.dataNascimento.split('/');
    const dataFormatadaBanco = `${ano}-${mes}-${dia}`;

    const payload = {
      paciente: {
        id_personalizado: paciente.id, 
        nome: paciente.nome,
        data_nascimento: dataFormatadaBanco,
        hospital_id: hospital.id
      },
      sintomas: {
        Idade: form.idade, Genero: form.genero, Fumo: form.fumo, Alcoolismo: form.alcoolismo,
        Freq_Respiratoria: form.freqRespiratoria, Freq_Cardiaca: form.freqCardiaca,
        Pressao_Sistolica: form.pressaoSistolica, Pressao_Diastolica: form.pressaoDiastolica,
        Sat_Oxigenio: form.satOxigenio, IMC: form.imc, Falta_Ar: form.faltaAr,
        Tosse: form.tosse, Tosse_Sangue: form.tosseSangue, Fadiga: form.fadiga, Chiado: form.chiado
      },
      observacoes: observacoes
    };

    try {
      const response = await api.post('/predicoes', payload);
      const idExato = response.data.data.predicao_id;
      navigate(`/resultado-predicao/${idExato}`);
    } catch (error) {
      console.error("Erro no processamento da predição:", error);
      alert(error.response?.data?.erro || "Erro ao processar a predição no motor de IA.");
    } finally {
      setCarregando(false);
    }
  };

  const renderOpcoes = (label, nomeKey, opcoes) => (
    <div className="mb-6">
      <label className="block text-[#1a3c5a] font-medium text-sm mb-3">{label}</label>
      <div className="flex flex-wrap gap-3">
        {opcoes.map((opcao) => (
          <button
            type="button"
            key={opcao.valor}
            onClick={() => setForm({ ...form, [nomeKey]: opcao.valor })}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${
              form[nomeKey] === opcao.valor
                ? 'bg-[#6eb1be] text-white shadow-sm'
                : 'bg-[#6eb1be]/60 text-white hover:bg-[#6eb1be]/80'
            }`}
          >
            {opcao.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#1a3c5a] mb-2">Formulário Clínico</h2>
          <p className="text-[#6eb1be] text-lg">Cadastro de nova predição e avaliação de risco</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          
          {/* Dados do Paciente */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-[#1a3c5a] mb-6 border-b border-gray-200 pb-3">
              Dados do Paciente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <label className="block text-[#1a3c5a] text-sm mb-2">Nome do paciente</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#1a3c5a]"
                  placeholder="Nome completo"
                  value={paciente.nome}
                  onChange={(e) => setPaciente({ ...paciente, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[#1a3c5a] text-sm mb-2">Data de nascimento</label>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  maxLength="10"
                  className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#1a3c5a]"
                  value={paciente.dataNascimento}
                  onChange={handleDataChange}
                />
              </div>
            </div>
            <div className="w-full md:w-[calc(50%-1rem)]">
              <label className="block text-[#1a3c5a] text-sm mb-2">Id do paciente</label>
              <input
                type="text"
                placeholder="Identificação opcional"
                className="w-full px-4 py-2 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#1a3c5a]"
                value={paciente.id}
                onChange={(e) => setPaciente({ ...paciente, id: e.target.value })}
              />
            </div>
          </div>

          {/* Formulário - Perguntas */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-[#1a3c5a] mb-8 border-b border-gray-200 pb-3">
              Formulário - Responda as perguntas abaixo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
              <div className="md:pr-10">
                {renderOpcoes("Qual a faixa etária do paciente?", "idade", [
                  { label: '30 a 50', valor: '30_a_50_anos' }, { label: '50 a 70', valor: '50_a_70_anos' }, { label: 'mais de 70', valor: 'Mais_de_70' }
                ])}
                {renderOpcoes("Qual o gênero do paciente?", "genero", [
                  { label: 'masculino', valor: 'M' }, { label: 'feminino', valor: 'F' }
                ])}
                {renderOpcoes("Qual o histórico de tabagismo?", "fumo", [
                  { label: 'fumante', valor: 'fumante_ativo' }, { label: 'ex fumante', valor: 'ex_fumante' }, { label: 'não fumante', valor: 'não_fumante' }
                ])}
                {renderOpcoes("Possui histórico de alcoolismo?", "alcoolismo", [
                  { label: 'sim', valor: 'Sim' }, { label: 'não', valor: 'Não' }
                ])}
                {renderOpcoes("Frequência Respiratória:", "freqRespiratoria", [
                  { label: 'normal', valor: 'Normal' }, { label: 'anormal', valor: 'Anormal' }
                ])}
                {renderOpcoes("Frequência Cardíaca:", "freqCardiaca", [
                  { label: 'normal', valor: 'Normal' }, { label: 'anormal', valor: 'Anormal' }
                ])}
                {renderOpcoes("Pressão Sistólica:", "pressaoSistolica", [
                  { label: 'normal', valor: 'Normal' }, { label: 'anormal', valor: 'Anormal' }
                ])}
                {renderOpcoes("Pressão Diastólica:", "pressaoDiastolica", [
                  { label: 'normal', valor: 'Normal' }, { label: 'anormal', valor: 'Anormal' }
                ])}
                {renderOpcoes("Saturação de Oxigênio (SpO2):", "satOxigenio", [
                  { label: 'normal', valor: 'Normal' }, { label: 'anormal', valor: 'Anormal' }
                ])}
              </div>

              <div className="md:pl-10 md:border-l md:border-gray-200">
                {renderOpcoes("Índice de Massa Corporal (IMC):", "imc", [
                  { label: 'normal', valor: 'Normal' }, { label: 'anormal', valor: 'Anormal' }
                ])}
                {renderOpcoes("O paciente apresenta Falta de Ar?", "faltaAr", [
                  { label: 'sim', valor: 'Sim' }, { label: 'não', valor: 'Não' }
                ])}
                {renderOpcoes("O paciente apresenta Tosse persistente?", "tosse", [
                  { label: 'sim', valor: 'Sim' }, { label: 'não', valor: 'Não' }
                ])}
                {renderOpcoes("O paciente apresenta Tosse com Sangue (Hemoptise)?", "tosseSangue", [
                  { label: 'sim', valor: 'Sim' }, { label: 'não', valor: 'Não' }
                ])}
                {renderOpcoes("O paciente relata Fadiga (cansaço extremo)?", "fadiga", [
                  { label: 'sim', valor: 'Sim' }, { label: 'não', valor: 'Não' }
                ])}
                {renderOpcoes("O paciente apresenta Chiado no peito?", "chiado", [
                  { label: 'sim', valor: 'Sim' }, { label: 'não', valor: 'Não' }
                ])}
              </div>
            </div>
          </div>

          {/* Observações Adicionais */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-[#1a3c5a] mb-6 border-b border-gray-200 pb-3">
              Observações Adicionais (Opcional)
            </h3>
            <textarea
              className="w-full h-32 p-6 rounded-2xl bg-white border border-gray-100 shadow-md focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#1a3c5a] resize-none"
              placeholder="Registre aqui informações complementares, resultados de exames específicos ou outras observações relevantes..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            ></textarea>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={carregando}
              className="flex items-center justify-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white px-8 py-3 rounded-full font-medium transition-colors disabled:opacity-50"
            >
              <Save size={20} /> {carregando ? "Salvando..." : "Salvar avaliação"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 border border-[#6eb1be] text-[#6eb1be] hover:bg-[#6eb1be] hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              <X size={20} /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}