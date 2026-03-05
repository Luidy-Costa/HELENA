import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';
import LoginMedico from './pages/LoginMedico';
import CadastroMedico from './pages/CadastroMedico';
import RecuperarSenha from './pages/RecuperarSenha';
import PainelMedico from './pages/PainelMedico';
import HospitalInterna from './pages/HospitalInterna';
import FormularioPredicao from './pages/FormularioPredicao'; // <--- Importe a tela

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
        
        {/* Nova Rota: Formulário */}
        <Route path="/formulario-predicao" element={<FormularioPredicao />} /> 
        
        {/* Placeholder para a próxima tela que faremos */}
        <Route path="/resultado-predicao" element={<div className="p-10 text-2xl font-bold">Aqui vai ser o laudo gerado! (Tela da Previsão)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;