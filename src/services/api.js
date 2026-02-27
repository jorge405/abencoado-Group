import axios from 'axios';

const API_PROD  = 'https://appbeta.abencoadogroup.com/abencoado/';
const API_LOCAL = 'http://localhost:3000/abencoado';

// `process` sólo existe en Node; en el navegador puede ser undefined.
// comprueba su existencia o usa la variable que provea tu bundler.
const npmEvent =
  typeof process !== 'undefined' && process.env
    ? process.env.npm_lifecycle_event
    : undefined;

// en Vite/CRA/Next/etc. tienes import.meta.env
const isDev =
  npmEvent === 'dev' ||
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    (import.meta.env.MODE === 'development' || import.meta.env.DEV));

const api = axios.create({
  baseURL: isDev ? API_LOCAL : API_PROD,
  timeout: 5000,
});

// interceptor de respuesta …
api.interceptors.response.use(
  resp => resp,
  async err => {
    const cfg = err.config;
    if (!cfg || cfg._retried) {
      return Promise.reject(err);
    }
    cfg._retried = true;
    if (err.response && err.response.status < 500) {
      return Promise.reject(err);
    }
    return axios({ ...cfg, baseURL: API_LOCAL });
  }
);

export default api;