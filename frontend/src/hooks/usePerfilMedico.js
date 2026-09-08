import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function usePerfilMedico(medicoId) {
  const [medico, setMedico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form local para edição
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    email: '',
    telefone: ''
  });

  const fetchMedico = useCallback(async () => {
    if (!medicoId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/medicos/${medicoId}`);
      setMedico(response.data);
      setFormData({
        nome: response.data.nome || '',
        crm: response.data.crm || '',
        especialidade: response.data.especialidade || '',
        email: response.data.email || '',
        telefone: response.data.telefone || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar perfil do médico.');
    } finally {
      setLoading(false);
    }
  }, [medicoId]);

  useEffect(() => {
    fetchMedico();
  }, [fetchMedico]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const atualizarPerfil = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await api.put(`/medicos/${medicoId}`, formData);
      setMedico(response.data);
      setSuccessMessage('Perfil atualizado com sucesso!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao atualizar dados.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    medico,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarPerfil,
    refetch: fetchMedico
  };
}