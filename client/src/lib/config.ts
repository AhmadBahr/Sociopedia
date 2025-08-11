const envApiUrl = import.meta.env.VITE_API_URL;
if (!envApiUrl) {
  throw new Error('VITE_API_URL environment variable is not set. Please check your .env file.');
}

export const API_URL = envApiUrl;
export const SERVER_ORIGIN = API_URL.replace(/\/?api\/?$/, '');

