import { useState } from 'react';
import api from '../services/api';

export function useConvidarMedico() {
  const [email, setEmail] = useState('');
  const [crm, setCrm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const enviarConvite = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');

      await api.post('/hospitais/convidar-medico', { email, crm });
      setSuccessMessage(`Convite enviado com sucesso para ${email}!`);
      setEmail('');
      setCrm('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao enviar convite ao médico.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    crm,
    setCrm,
    loading,
    error,
    successMessage,
    enviarConvite
  };
}