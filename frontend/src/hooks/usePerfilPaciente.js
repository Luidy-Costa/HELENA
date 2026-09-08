import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function usePerfilPaciente(pacienteId) {
  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    alergias: '',
    comorbidades: ''
  });

  const fetchPaciente = useCallback(async () => {
    if (!pacienteId) return;
    try {
      setLoading(true);
      setError(null);

      const [resPaciente, resHistorico] = await Promise.all([
        api.get(`/pacientes/${pacienteId}`),
        api.get(`/pacientes/${pacienteId}/historico`)
      ]);

      setPaciente(resPaciente.data);
      setHistorico(resHistorico.data || []);
      setFormData({
        nome: resPaciente.data.nome || '',
        cpf: resPaciente.data.cpf || '',
        dataNascimento: resPaciente.data.dataNascimento || '',
        telefone: resPaciente.data.telefone || '',
        alergias: resPaciente.data.alergias || '',
        comorbidades: resPaciente.data.comorbidades || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar dados do paciente.');
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    fetchPaciente();
  }, [fetchPaciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const atualizarPaciente = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await api.put(`/pacientes/${pacienteId}`, formData);
      setPaciente(response.data);
      setSuccessMessage('Dados do paciente atualizados com sucesso!');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar dados do paciente.');
    } finally {
      setSaving(false);
    }
  };

  return {
    paciente,
    historico,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarPaciente,
    refetch: fetchPaciente
  };
}