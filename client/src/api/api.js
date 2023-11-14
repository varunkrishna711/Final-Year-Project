import axios from "axios";

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authAdminHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
};

const authAdminInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("adminToken")}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);
$authAdminHost.interceptors.request.use(authAdminInterceptor);

export { $host, $authHost, $authAdminHost };
