import { env } from '@repo/env/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import onError from '@repo/server-utils/handlers/error';
import notFound from '@repo/server-utils/handlers/not-found';

const app = new Hono();

app.use(
  '/api/*',
  cors({
    origin: env.ALLOWED_ORIGINS,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);


app.get('/', (c) => {
  return c.text('API server is running');
});

app.notFound(notFound);
app.onError(onError);

export default app;
