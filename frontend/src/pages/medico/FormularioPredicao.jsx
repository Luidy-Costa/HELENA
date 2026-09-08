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
    idPaciente: ''
  });

  const [form, setForm] = useState({
    idade: '', genero: '', fumo: '', alcoolismo: '',
    freqRespiratoria: '', freqCardiaca: '', pressaoSistolica: '',
    pressaoDiastolica: '', satOxigenio: '', imc: '',
    faltaAr: '', tosse: '', tosseSangue: '', fadiga: '', chiado: ''
  });

  const [observacoes, setObservacoes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hospital) {
      alert("Erro: Nenhum hospital selecionado. Volte e acesse o hospital novamente.");
      return;
    }

    if (!paciente.nome.trim() || !paciente.dataNascimento.trim()) {
      alert("Atenção: O Nome e a Data de Nascimento do paciente são obrigatórios!");
      return;
    }

    const payload = {
      paciente: {
        nome: paciente.nome,
        data_nascimento: paciente.dataNascimento,
        hospital_id: hospital.id
      },
      sintomas: {
        Idade: parseInt(form.idade) || 0,
        Genero: form.genero,
        Fumo: form.fumo,
        Alcoolismo: form.alcoolismo === 'sim' ? 1 : 0,
        Freq_Respiratoria: form.freqRespiratoria,
        Freq_Cardiaca: form.freqCardiaca,
        Pressao_Sistolica: form.pressaoSistolica,
        Pressao_Diastolica: form.pressaoDiastolica,
        Sat_Oxigenio: form.satOxigenio,
        IMC: form.imc,
        Falta_Ar: form.faltaAr === 'sim' ? 1 : 0,
        Tosse: form.tosse === 'sim' ? 1 : 0,
        Tosse_Sangue: form.tosseSangue === 'sim' ? 1 : 0,
        Fadiga: form.fadiga === 'sim' ? 1 : 0,
        Chiado: form.chiado === 'sim' ? 1 : 0
      },
      observacoes: observacoes
    };

    try {
      const response = await api.post('/predicoes', payload);
      const idExato = response.data.data.predicao_id;

      navigate('/resultado-predicao', { 
        state: { 
          id_predicao: idExato,
          pacienteInfo: paciente,
          hospitalInfo: hospital,
          respostasForm: form
        } 
      });
    } catch (error) {
      console.error("Erro no processamento da predição:", error);
      alert(error.response?.data?.erro || "Erro ao processar a predição.");
    }
  };

  const OpcoesPill = ({ label, nomeKey, opcoes }) => (
    <div className="mb-5">
      <label className="block text-[#0b2b3f] font-bold text-sm mb-2">{label}</label>
      <div className="flex flex-wrap gap-3">
        {opcoes.map((opcao) => (
          <button
            type="button"
            key={opcao.valor}
            onClick={() => setForm({ ...form, [nomeKey]: opcao.valor })}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              form[nomeKey] === opcao.valor
                ? 'bg-[#6eb1be] text-white shadow-md'
                : 'bg-[#6eb1be]/20 text-[#0b2b3f] hover:bg-[#6eb1be]/40'
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
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#6eb1be] hover:text-[#0b2b3f] transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b2b3f] mb-1">Formulário Clínico</h2>
        <p className="text-[#6eb1be] text-lg font-medium">Cadastro de nova predição e avaliação de risco</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-10">
          <h3 className="text-xl font-bold text-[#0b2b3f] mb-4 border-b border-gray-100 pb-2">
            Dados do Paciente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Nome do paciente</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                placeholder="Nome completo"
                value={paciente.nome}
                onChange={(e) => setPaciente({ ...paciente, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[#0b2b3f] font-bold text-sm mb-1">Data de nascimento</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
                placeholder="dd/mm/aaaa"
                value={paciente.dataNascimento}
                onChange={(e) => setPaciente({ ...paciente, dataNascimento: e.target.value })}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pr-3">
            <label className="block text-[#0b2b3f] font-bold text-sm mb-1">ID do paciente</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f]"
              placeholder="Ex: PRN-2026-001 (Deixe em branco para criar novo)"
              value={paciente.idPaciente}
              onChange={(e) => setPaciente({ ...paciente, idPaciente: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-[#0b2b3f] mb-6 border-b border-gray-100 pb-2">
            Formulário - Responda as perguntas abaixo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <div>
              <OpcoesPill label="Qual a faixa etária do paciente?" nomeKey="idade" opcoes={[
                { label: '30 a 50', valor: '30_a_50' }, { label: '50 a 70', valor: '50_a_70' }, { label: 'mais de 70', valor: 'mais_70' }
              ]} />
              <OpcoesPill label="Qual o gênero do paciente?" nomeKey="genero" opcoes={[
                { label: 'masculino', valor: 'm' }, { label: 'feminino', valor: 'f' }
              ]} />
              <OpcoesPill label="Qual o histórico de tabagismo?" nomeKey="fumo" opcoes={[
                { label: 'fumante', valor: 'fumante_ativo' }, { label: 'ex fumante', valor: 'ex_fumante' }, { label: 'não fumante', valor: 'nao_fumante' }
              ]} />
              <OpcoesPill label="Possui histórico de alcoolismo?" nomeKey="alcoolismo" opcoes={[
                { label: 'sim', valor: 'sim' }, { label: 'não', valor: 'nao' }
              ]} />
              <OpcoesPill label="Frequência Respiratória:" nomeKey="freqRespiratoria" opcoes={[
                { label: 'normal', valor: 'normal' }, { label: 'anormal', valor: 'anormal' }
              ]} />
              <OpcoesPill label="Frequência Cardíaca:" nomeKey="freqCardiaca" opcoes={[
                { label: 'normal', valor: 'normal' }, { label: 'anormal', valor: 'anormal' }
              ]} />
              <OpcoesPill label="Pressão Sistólica:" nomeKey="pressaoSistolica" opcoes={[
                { label: 'normal', valor: 'normal' }, { label: 'anormal', valor: 'anormal' }
              ]} />
              <OpcoesPill label="Pressão Diastólica:" nomeKey="pressaoDiastolica" opcoes={[
                { label: 'normal', valor: 'normal' }, { label: 'anormal', valor: 'anormal' }
              ]} />
              <OpcoesPill label="Saturação de Oxigênio (SpO2):" nomeKey="satOxigenio" opcoes={[
                { label: 'normal', valor: 'normal' }, { label: 'anormal', valor: 'anormal' }
              ]} />
            </div>

            <div>
              <OpcoesPill label="Índice de Massa Corporal (IMC):" nomeKey="imc" opcoes={[
                { label: 'normal', valor: 'normal' }, { label: 'anormal', valor: 'anormal' }
              ]} />
              <OpcoesPill label="O paciente apresenta Falta de Ar?" nomeKey="faltaAr" opcoes={[
                { label: 'sim', valor: 'sim' }, { label: 'não', valor: 'nao' }
              ]} />
              <OpcoesPill label="O paciente apresenta Tosse persistente?" nomeKey="tosse" opcoes={[
                { label: 'sim', valor: 'sim' }, { label: 'não', valor: 'nao' }
              ]} />
              <OpcoesPill label="O paciente apresenta Tosse com Sangue (Hemoptise)?" nomeKey="tosseSangue" opcoes={[
                { label: 'sim', valor: 'sim' }, { label: 'não', valor: 'nao' }
              ]} />
              <OpcoesPill label="O paciente relata Fadiga (cansaço extremo)?" nomeKey="fadiga" opcoes={[
                { label: 'sim', valor: 'sim' }, { label: 'não', valor: 'nao' }
              ]} />
              <OpcoesPill label="O paciente apresenta Chiado no peito?" nomeKey="chiado" opcoes={[
                { label: 'sim', valor: 'sim' }, { label: 'não', valor: 'nao' }
              ]} />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#0b2b3f] mb-4 border-b border-gray-100 pb-2">
            Observações Adicionais (Opcional)
          </h3>
          <textarea
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-[#f4f9fb]/50 focus:ring-2 focus:ring-[#6eb1be] outline-none text-[#0b2b3f] min-h-[120px] resize-y"
            placeholder="Registre aqui informações complementares, resultados de exames específicos ou outras observações relevantes..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 bg-[#6eb1be] hover:bg-[#5ca0ad] text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg"
          >
            <Save size={20} /> Salvar avaliação
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 px-8 py-3 rounded-full font-bold transition-colors"
          >
            <X size={20} /> Cancelar
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}