import { Elysia } from 'elysia';
import { loginPayload, jwtAccessSetup, jwtRefreshSetup } from './setup';
import { randomUUID } from 'crypto';

export const login = new Elysia()
  .use(loginPayload)
  .use(jwtAccessSetup)
  .use(jwtRefreshSetup)
  .post(
    '/login',
    async function handler({ body, set, jwtAccess, jwtRefresh }) {
      const { email, password } = body;

      if (email !== process.env.EMAIL) {
        set.status = 400;
        return {
          message: 'Email or password is incorrect.',
        };
      }
      const hashPassword = await Bun.password.hash(process.env.PASSWORD ?? '');
      const validPassword = await Bun.password.verify(password, hashPassword);

      if (!validPassword) {
        set.status = 400;
        return {
          message: 'Email or password is incorrect.',
        };
      }

      const userInfo = {
        id: randomUUID(),
        email,
      };

      const refreshId = randomUUID();
      const refreshToken = await jwtRefresh.sign({
        id: refreshId,
      });

      // save refreshToken into DB

      const accessToken = await jwtAccess.sign(userInfo);
      return {
        accessToken,
        refreshToken,
      };
    },
    {
      body: 'loginPayload',
    }
  );
