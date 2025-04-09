import axios from "axios";
import config from "../src/configClient.json";

const api = axios.create({
  baseURL: config.UrlApi, // Укажите URL вашего сервера
});

export default api;
