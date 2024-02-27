import { Elysia } from 'elysia';
import { login } from './login';
import { refresh } from './refresh';

export const auth = new Elysia({
  prefix: '/auth',
})
  .use(login)
  .use(refresh);
