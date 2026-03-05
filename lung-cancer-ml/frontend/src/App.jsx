import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';
import LoginMedico from './pages/LoginMedico';
import CadastroMedico from './pages/CadastroMedico'; // <--- Importe aqui

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/login-medico" element={<LoginMedico />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} /> {/* <--- Atualize aqui */}
        <Route path="/recuperar-senha" element={<div className="p-10 text-2xl font-bold">Aqui será a recuperação...</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;