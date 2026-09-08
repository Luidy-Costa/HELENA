import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useResultadoPredicao(predicaoId) {
  const [predicao, setPredicao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Campo de parecer do médico
  const [observacaoMedica, setObservacaoMedica] = useState('');

  const fetchPredicao = useCallback(async () => {
    if (!predicaoId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/predicoes/${predicaoId}`);
      setPredicao(response.data);
      setObservacaoMedica(response.data.observacaoMedica || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar o resultado da predição.');
    } finally {
      setLoading(false);
    }
  }, [predicaoId]);

  useEffect(() => {
    fetchPredicao();
  }, [fetchPredicao]);

  const salvarParecer = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      await api.patch(`/predicoes/${predicaoId}`, {
        observacaoMedica,
        validadoEm: new Date().toISOString()
      });

      setSuccessMessage('Parecer médico salvo com sucesso!');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o parecer médico.');
    } finally {
      setSaving(false);
    }
  };

  return {
    predicao,
    observacaoMedica,
    setObservacaoMedica,
    loading,
    saving,
    error,
    successMessage,
    salvarParecer,
    refetch: fetchPredicao
  };
}