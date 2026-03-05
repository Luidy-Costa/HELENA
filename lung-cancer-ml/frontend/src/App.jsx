import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';
import LoginMedico from './pages/LoginMedico'; // <--- Importe a tela aqui

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSelecao />} />
        <Route path="/login-medico" element={<LoginMedico />} /> {/* <--- Adicione a rota */}
        <Route path="/cadastro-medico" element={<div className="p-10 text-2xl font-bold">Aqui será a tela de Cadastro...</div>} />
        <Route path="/recuperar-senha" element={<div className="p-10 text-2xl font-bold">Aqui será a recuperação...</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;