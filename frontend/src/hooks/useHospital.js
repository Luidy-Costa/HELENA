import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useHospital(hospitalId) {
  const [hospitalData, setHospitalData] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  const fetchData = useCallback(async () => {
    if (!hospitalId) return;
    try {
      setLoading(true);
      setError(null);
      
      const [resHospital, resPacientes] = await Promise.all([
        api.get(`/hospitais/${hospitalId}`),
        api.get(`/hospitais/${hospitalId}/pacientes`)
      ]);

      setHospitalData(resHospital.data);
      
      // Blindagem: Garante que mesmo se o backend mandar dentro de um objeto { pacientes: [] }, o React entenda
      const dadosPacientes = resPacientes.data;
      setPacientes(Array.isArray(dadosPacientes) ? dadosPacientes : (dadosPacientes.pacientes || []));

    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao carregar informações da área interna.');
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const atualizarStatusPaciente = async (pacienteId, novoStatus) => {
    try {
      await api.patch(`/pacientes/${pacienteId}`, { status: novoStatus });
      await fetchData(); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.erro || 'Erro ao atualizar status.' };
    }
  };

  // Filtro ajustado para pegar qualquer variação de nome
  const pacientesFiltrados = pacientes.filter(p => {
    const nome = p.nome_completo || p.nome || '';
    return nome.toLowerCase().includes(filtro.toLowerCase()) || p.cpf?.includes(filtro);
  });

  return {
    hospitalData,
    pacientes: pacientesFiltrados,
    loading,
    error,
    filtro,
    setFiltro,
    refetch: fetchData,
    atualizarStatusPaciente
  };
}