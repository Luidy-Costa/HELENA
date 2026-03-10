import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importações - Telas Gerais (Na raiz de pages)
import LoginSelecao from './pages/LoginSelecao';
import RecuperarSenha from './pages/RecuperarSenha';

// Importações - Ator: Médico (Dentro da pasta medico)
import LoginMedico from './pages/medico/LoginMedico';
import CadastroMedico from './pages/medico/CadastroMedico';
import PainelMedico from './pages/medico/PainelMedico';
import HospitalInterna from './pages/medico/HospitalInterna';
import FormularioPredicao from './pages/medico/FormularioPredicao';
import ResultadoPredicao from './pages/medico/ResultadoPredicao';
import PerfilPaciente from './pages/medico/PerfilPaciente';
import HistoricoPredicoes from './pages/medico/HistoricoPredicoes';
import PerfilMedico from './pages/medico/PerfilMedico';

// Importações - Ator: Hospital (Dentro da pasta hospital)
import LoginHospital from './pages/hospital/LoginHospital';
import CadastroHospital from './pages/hospital/CadastroHospital';
import PainelHospital from './pages/hospital/PainelHospital';
import PerfilHospital from './pages/hospital/PerfilHospital';
import ConvidarMedico from './pages/hospital/ConvidarMedico';
import PerfilMedicoHospital from './pages/hospital/PerfilMedicoHospital';
import HistoricoPacientesHospital from './pages/hospital/HistoricoPacientesHospital';
import PerfilPacienteHospital from './pages/hospital/PerfilPacienteHospital';
import PrevisaoHospital from './pages/hospital/PrevisaoHospital';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Iniciais e Gerais */}
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Rotas do Ator Médico */}
        <Route path="/login-medico" element={<LoginMedico />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} />
        <Route path="/painel-medico" element={<PainelMedico />} />
        <Route path="/hospital-interna" element={<HospitalInterna />} />
        <Route path="/formulario-predicao" element={<FormularioPredicao />} />
        <Route path="/resultado-predicao" element={<ResultadoPredicao />} />
        <Route path="/perfil-paciente" element={<PerfilPaciente />} />
        <Route path="/historico-predicoes" element={<HistoricoPredicoes />} />
        <Route path="/perfil-medico" element={<PerfilMedico />} />

        {/* Rotas do Ator Hospital */}
        <Route path="/login-hospital" element={<LoginHospital />} />
        <Route path="/cadastro-hospital" element={<CadastroHospital />} />
        <Route path="/painel-hospital" element={<PainelHospital />} />
        <Route path="/perfil-hospital" element={<PerfilHospital />} />
        <Route path="/convidar-medico" element={<ConvidarMedico />} />
        <Route path="/perfil-medico-hospital" element={<PerfilMedicoHospital />} />
        <Route path="/historico-pacientes-hospital" element={<HistoricoPacientesHospital />} />
        <Route path="/perfil-paciente-hospital" element={<PerfilPacienteHospital />} />
        <Route path="/previsao-hospital" element={<PrevisaoHospital />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;