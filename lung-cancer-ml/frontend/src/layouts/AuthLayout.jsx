import React from "react";
import logoImg from '../assets/logo.png';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex font-sans">
      {/* ==================== LADO ESQUERDO (ESTÁTICO/BRANDING) ==================== */}
      <div className="hidden lg:flex w-1/2 bg-[#6eb1be] flex-col justify-between p-12 relative overflow-hidden">
        {/* Logo LCP */}
        <div className="flex flex-col items-center mt-8">
          <img 
                      src={logoImg} 
                      alt="LCP Logo" 
                      className="w-23 h-20 object-contain rounded-md" 
                    />
          <h1 className="text-white text-5xl font-bold mt-2 tracking-wider">
            LCP
          </h1>
          <p className="text-white/90 font-medium text-lg mt-1">
            Lung Cancer Prediction
          </p>
        </div>

        {/* Textos Centrais */}
        <div className="text-white mt-8 mb-4">
          <h2 className="text-4xl font-bold mb-4">
            Diagnóstico precoce salva vidas!
          </h2>
          <p className="text-white/90 text-lg leading-relaxed max-w-lg">
            O{" "}
            <strong className="text-white font-semibold">
              Lung Cancer Prediction
            </strong>{" "}
            é um sistema desenvolvido para auxiliar profissionais da saúde na
            detecção precoce e acompanhamento de casos de câncer de pulmão.
          </p>
        </div>

        {/* Card Escuro (Por que implantar) */}
        <div className="bg-[#0b2b3f] rounded-2xl p-6 flex items-end relative overflow-hidden shadow-2xl">
          <div className="w-2/3 pr-4 z-10 relative">
            <h3 className="text-white font-bold text-xl mb-4">
              Por que implantar este sistema?
            </h3>
            <ul className="text-white/80 text-sm space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">•</span>
                <span>
                  <strong>Detecção precoce:</strong> Identificação rápida de
                  pacientes de risco através de questionários estruturados.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">•</span>
                <span>
                  <strong>Gestão centralizada:</strong> Todos os prontuários e
                  históricos clínicos em um único lugar.
                </span>
              </li>
            </ul>
          </div>
          {/* Imagem do Médico (Placeholder via Unsplash para simular seu design) */}
          <div className="absolute bottom-0 right-0 w-1/3 h-[130%]">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
              alt="Médico"
              className="w-full h-full object-cover object-top opacity-90 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2b3f] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0b2b3f]" />
          </div>
        </div>
      </div>

      {/* ==================== LADO DIREITO (DINÂMICO/CHILDREN) ==================== */}
      <div className="w-full lg:w-1/2 bg-[#f4f9fb] flex items-center justify-center p-8">
        {/* A propriedade children injeta o formulário da tela atual aqui dentro */}
        <div className="max-w-md w-full">{children}</div>
      </div>
    </div>
  );
}
