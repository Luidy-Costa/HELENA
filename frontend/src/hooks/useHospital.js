import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useHospital(hospitalId) {
  const [hospitalData, setHospitalData] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  // Busca dados do hospital e leitos/pacientes
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
      setPacientes(resPacientes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar informações da área interna.');
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Atualizar leito ou status de paciente
  const atualizarStatusPaciente = async (pacienteId, novoStatus) => {
    try {
      await api.patch(`/pacientes/${pacienteId}`, { status: novoStatus });
      await fetchData(); // Recarrega para manter os dados sincronizados
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Erro ao atualizar status.' };
    }
  };

  // Filtragem local de pacientes por nome/CPF
  const pacientesFiltrados = pacientes.filter(p => 
    p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.cpf?.includes(filtro)
  );

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