import axios from "axios";
const baseUrl = "http://localhost:8080/api/";
// const baseUrl = "http://178.128.22.90:8080/api/";
// const baseUrl = "/api/";

const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

const handleBefore = (config) => {
  const token = sessionStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore, null);

export default api;
