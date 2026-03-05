import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelecao from './pages/LoginSelecao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela Inicial: A seleção de perfil */}
        <Route path="/" element={<LoginSelecao />} />
        
        {/* Deixando os caminhos preparados para os próximos passos */}
        <Route path="/login-medico" element={<div className="p-10 text-2xl font-bold">Aqui será a tela de Login do Médico...</div>} />
        <Route path="/cadastro-medico" element={<div className="p-10 text-2xl font-bold">Aqui será a tela de Cadastro...</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;