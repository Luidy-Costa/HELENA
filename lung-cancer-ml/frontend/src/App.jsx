import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Activity } from 'lucide-react'

// Uma "Página" de teste rápida
function TelaTeste() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
        {/* Testando o Lucide React com uma cor do Tailwind v4 */}
        <Activity size={48} className="text-blue-600" />
        
        {/* Testando fontes e cores do Tailwind */}
        <h1 className="text-3xl font-bold text-gray-800">
          Frontend Conectado!
        </h1>
        <p className="text-gray-500">
          Tailwind v4, Lucide e Rotas estão prontos para a ação.
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Aqui depois vamos colocar /login, /dashboard, etc */}
        <Route path="/" element={<TelaTeste />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App