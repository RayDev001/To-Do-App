// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Cambia 'localhost' por la IP de tu máquina si es necesario

const api = axios.create({
  baseURL: API_URL,
});

export default api;
