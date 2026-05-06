import axios from 'axios';

// Cria uma instância do axios apontando para o seu backend Flask
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', 
});

// Interceptor para injetar o Token em todas as requisições (deixaremos pronto para o futuro)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@LCP:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;