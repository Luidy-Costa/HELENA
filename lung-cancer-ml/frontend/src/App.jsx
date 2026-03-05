import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';
import LoginMedico from './pages/LoginMedico';
import CadastroMedico from './pages/CadastroMedico';
import RecuperarSenha from './pages/RecuperarSenha';
import PainelMedico from './pages/PainelMedico'; // <--- Importe a nova tela

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/login-medico" element={<LoginMedico />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Rota da área logada */}
        <Route path="/painel-medico" element={<PainelMedico />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;