import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginSelecao from './pages/LoginSelecao';
import RecuperarSenha from './pages/RecuperarSenha';

// Módulo Admin
import LoginAdmin from './pages/admin/LoginAdmin';
import PainelAdmin from './pages/admin/PainelAdmin'; 
import PerfilAdmin from './pages/admin/PerfilAdmin';
import CadastroHospitalAdmin from './pages/admin/CadastroHospitalAdmin';
import HospitalInternaAdmin from './pages/admin/HospitalInternaAdmin';
import ConvidarMedicoAdmin from './pages/admin/ConvidarMedicoAdmin'; 
import PerfilMedicoAdmin from './pages/admin/PerfilMedicoAdmin';     
import PerfilPacienteAdmin from './pages/admin/PerfilPacienteAdmin'; // <-- IMPORTAÇÃO ADICIONADA
import PrevisaoAdmin from './pages/admin/PrevisaoAdmin';             // <-- IMPORTAÇÃO ADICIONADA

// Módulo Médico
import LoginMedico from './pages/medico/LoginMedico';
import CadastroMedico from './pages/medico/CadastroMedico';
import PainelMedico from './pages/medico/PainelMedico';
import HospitalInterna from './pages/medico/HospitalInterna';
import FormularioPredicao from './pages/medico/FormularioPredicao';
import ResultadoPredicao from './pages/medico/ResultadoPredicao';
import PerfilPaciente from './pages/medico/PerfilPaciente';
import HistoricoPredicoes from './pages/medico/HistoricoPredicoes';
import PerfilMedico from './pages/medico/PerfilMedico';

// Módulo Hospital
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
        {/* Autenticação & Geral */}
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Fluxo Admin */}
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/painel-admin" element={<PainelAdmin />} /> 
        <Route path="/admin/perfil" element={<PerfilAdmin />} />
        <Route path="/admin/cadastro-hospital" element={<CadastroHospitalAdmin />} />
        <Route path="/admin/hospital/:id" element={<HospitalInternaAdmin />} />
        <Route path="/admin/convidar-medico" element={<ConvidarMedicoAdmin />} />
        <Route path="/admin/perfil-medico" element={<PerfilMedicoAdmin />} />
        <Route path="/admin/perfil-paciente" element={<PerfilPacienteAdmin />} /> {/* <-- ROTA ADICIONADA */}
        <Route path="/admin/previsao" element={<PrevisaoAdmin />} />             {/* <-- ROTA ADICIONADA */}

        {/* Fluxo Médico */}
        <Route path="/login-medico" element={<LoginMedico />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} />
        <Route path="/painel-medico" element={<PainelMedico />} />
        <Route path="/hospital-interna" element={<HospitalInterna />} />
        <Route path="/hospital-interna/:id" element={<HospitalInterna />} />
        <Route path="/formulario-predicao" element={<FormularioPredicao />} />
        <Route path="/resultado-predicao" element={<ResultadoPredicao />} />
        <Route path="/resultado-predicao/:id" element={<ResultadoPredicao />} />
        <Route path="/perfil-paciente" element={<PerfilPaciente />} />
        <Route path="/perfil-paciente/:id" element={<PerfilPaciente />} />
        <Route path="/historico-predicoes" element={<HistoricoPredicoes />} />
        <Route path="/perfil-medico" element={<PerfilMedico />} />
        <Route path="/perfil-medico/:id" element={<PerfilMedico />} />

        {/* Fluxo Hospital */}
        <Route path="/login-hospital" element={<LoginHospital />} />
        <Route path="/cadastro-hospital" element={<CadastroHospital />} />
        <Route path="/painel-hospital" element={<PainelHospital />} />
        <Route path="/perfil-hospital" element={<PerfilHospital />} />
        <Route path="/convidar-medico" element={<ConvidarMedico />} />
        <Route path="/perfil-medico-hospital" element={<PerfilMedicoHospital />} />
        <Route path="/perfil-medico-hospital/:id" element={<PerfilMedicoHospital />} />
        <Route path="/historico-pacientes-hospital" element={<HistoricoPacientesHospital />} />
        <Route path="/perfil-paciente-hospital" element={<PerfilPacienteHospital />} />
        <Route path="/perfil-paciente-hospital/:id" element={<PerfilPacienteHospital />} />
        <Route path="/previsao-hospital" element={<PrevisaoHospital />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;