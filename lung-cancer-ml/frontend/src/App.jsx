import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';
import LoginMedico from './pages/LoginMedico';
import CadastroMedico from './pages/CadastroMedico';
import RecuperarSenha from './pages/RecuperarSenha';
import PainelMedico from './pages/PainelMedico';
import HospitalInterna from './pages/HospitalInterna'; // <--- Importe a tela

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/login-medico" element={<LoginMedico />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/painel-medico" element={<PainelMedico />} />
        
        {/* Nova Rota do Hospital */}
        <Route path="/hospital-interna" element={<HospitalInterna />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;