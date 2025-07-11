import axios from "axios";

const instance = axios.create({
  baseURL: "https://contemporary-leia-vominhthien-093a2625.koyeb.app/",
  timeout: 20000,
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
