import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: 'https://menjichatback.menjidrc.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 5000, // Timeout de 10 secondes
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log pour le débogage (optionnel)
    console.log(`Requête ${config.method.toUpperCase()} : ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject({
      message: 'Erreur lors de l\'envoi de la requête',
      originalError: error,
      type: 'REQUEST_ERROR'
    });
  }
);


export default api;