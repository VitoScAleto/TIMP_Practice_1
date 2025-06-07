import axios from "axios";
import config from "../src/configClient.json";

const api = axios.create({
  baseURL: config.UrlApi,
  withCredentials: true,
});

export default api;
