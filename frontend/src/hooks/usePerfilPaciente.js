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
    nome_completo: '',
    data_nascimento: '',
    id_personalizado: '', // Adicionamos aqui
    telefone: '',
    alergias: '',
    comorbidades: ''
  });

  const fetchPaciente = useCallback(async () => {
    if (!pacienteId) return;
    try {
      setLoading(true);
      setError(null);

      // Puxa tudo da nossa rota nova
      const response = await api.get(`/pacientes/${pacienteId}/historico`);
      const dadosPaciente = response.data.paciente;
      
      setPaciente(dadosPaciente);
      setHistorico(response.data.historico || []);
      
      // Mapeia para o formulário
      setFormData({
        nome_completo: dadosPaciente.nome_completo || '',
        data_nascimento: dadosPaciente.data_nascimento || '',
        id_personalizado: dadosPaciente.id_personalizado || '', // Preenche o ID
        telefone: dadosPaciente.telefone || '',
        alergias: dadosPaciente.alergias || '',
        comorbidades: dadosPaciente.comorbidades || ''
      });
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao carregar dados do paciente.');
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

      // TRUQUE: Clonamos o formData e enviamos "nome" para o Flask aceitar
      const payload = {
        ...formData,
        nome: formData.nome_completo 
      };

      const response = await api.put(`/pacientes/${pacienteId}`, payload);
      setPaciente(response.data);
      setSuccessMessage('Dados do paciente atualizados com sucesso!');
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao atualizar dados do paciente.');
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