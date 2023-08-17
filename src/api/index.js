import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kresus.99starzplayers.com/v1/',
});

export const signup = data => api.post('/auth/signup', data);

export const verify = data =>
  api.post(`/auth/email-verification/${data.token}`, { code: data.code });
