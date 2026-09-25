import axios from "axios";

const api = axios.create({
  baseURL: "https://products-production-b803.up.railway.app/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

//http://192.168.1.5:3000/
