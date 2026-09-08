import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function usePerfilHospital(hospitalId) {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    leitosTotais: 0
  });

  const fetchHospital = useCallback(async () => {
    if (!hospitalId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/hospitais/${hospitalId}`);
      setHospital(response.data);
      setFormData({
        nome: response.data.nome || '',
        cnpj: response.data.cnpj || '',
        endereco: response.data.endereco || '',
        telefone: response.data.telefone || '',
        leitosTotais: response.data.leitosTotais || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar dados do hospital.');
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchHospital();
  }, [fetchHospital]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const atualizarHospital = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await api.put(`/hospitais/${hospitalId}`, formData);
      setHospital(response.data);
      setSuccessMessage('Dados institucionais atualizados com sucesso!');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar dados do hospital.');
    } finally {
      setSaving(false);
    }
  };

  return {
    hospital,
    formData,
    loading,
    saving,
    error,
    successMessage,
    handleChange,
    atualizarHospital,
    refetch: fetchHospital
  };
}