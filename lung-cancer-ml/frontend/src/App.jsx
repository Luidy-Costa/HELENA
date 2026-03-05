import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';
import LoginMedico from './pages/LoginMedico';
import CadastroMedico from './pages/CadastroMedico';
import RecuperarSenha from './pages/RecuperarSenha';
import PainelMedico from './pages/PainelMedico';
import HospitalInterna from './pages/HospitalInterna';
import FormularioPredicao from './pages/FormularioPredicao';
import ResultadoPredicao from './pages/ResultadoPredicao';
import PerfilPaciente from './pages/PerfilPaciente'; // <--- Importe a tela aqui

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/login-medico" element={<LoginMedico />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/painel-medico" element={<PainelMedico />} />
        <Route path="/hospital-interna" element={<HospitalInterna />} />
        <Route path="/formulario-predicao" element={<FormularioPredicao />} />
        <Route path="/resultado-predicao" element={<ResultadoPredicao />} />
        
        {/* Nova Rota: Perfil do Paciente */}
        <Route path="/perfil-paciente" element={<PerfilPaciente />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;