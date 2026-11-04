import ky from 'ky';
import { env, requireTmdbToken } from '../config/env';
export const tmdbClient = ky.create({
  baseUrl: env.tmdbApiBaseUrl.replace(/\/+$/, '') + '/',
  headers: { Authorization: 'Bearer ' + env.tmdbAccessToken, Accept: 'application/json' },
  timeout: 10000,
  retry: 0,
  hooks: { beforeRequest: [() => { requireTmdbToken(); }] },
});
