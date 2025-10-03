import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ajusta si backend está en otro puerto
});

export default api;
