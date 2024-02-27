import { jwt } from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';

export const loginPayload = new Elysia().model({
  loginPayload: t.Object({
    email: t.String(),
    password: t.String(),
  }),
});

export const refreshPayload = new Elysia().model({
  refreshPayload: t.Object({
    refreshToken: t.String(),
  }),
});

export const jwtAccessSetup = new Elysia({
  name: 'jwtAccess',
}).use(
  jwt({
    name: 'jwtAccess',
    schema: t.Object({
      id: t.String(),
    }),
    secret: process.env.JWT_ACCESS_SECRET!,
    exp: '5m',
  })
);

export const jwtRefreshSetup = new Elysia({
  name: 'jwtRefresh',
}).use(
  jwt({
    name: 'jwtRefresh',
    schema: t.Object({
      id: t.String(),
    }),
    secret: process.env.JWT_REFRESH_SECRET!,
    exp: '7d',
  })
);
