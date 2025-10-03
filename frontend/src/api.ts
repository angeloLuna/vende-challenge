import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000/api", // Pruebas en local
  baseURL: "https://vende-challenge.onrender.com/api", // Pruebas en local
});

export default api;
