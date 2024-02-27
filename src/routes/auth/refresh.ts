import { Elysia } from 'elysia';
import { jwtAccessSetup, jwtRefreshSetup, refreshPayload } from './setup';
import { randomUUID } from 'crypto';

export const refresh = new Elysia()
  .use(refreshPayload)
  .use(jwtRefreshSetup)
  .use(jwtAccessSetup)
  .post(
    '/refresh',
    async function handler({ body, set, jwtAccess, jwtRefresh }) {
      const { refreshToken } = body;

      const payload = await jwtRefresh.verify(refreshToken);
      if (!payload) {
        set.status = 401;
        return {
          message: 'Unauthorized.',
        };
      }

      // TODO: check refreshToken exists in DB

      const refreshId = randomUUID();
      const newRefreshToken = await jwtRefresh.sign({
        id: refreshId,
      });

      // TODO: delete and create new refreshToken in DB

      // TODO: get user info
      const userInfo = {
        id: randomUUID(),
        email: process.env.EMAIL,
      };

      const accessToken = await jwtAccess.sign(userInfo);
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    },
    {
      body: 'refreshPayload',
    }
  );
