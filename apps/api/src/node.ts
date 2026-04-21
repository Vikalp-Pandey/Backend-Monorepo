import { serve } from '@hono/node-server';
import app from '@/app';

serve({ fetch: app.fetch, port: 8000 }, (info) => {
  // eslint-disable-next-line no-console
  console.info(`Server is running on port ${info.port}`);
});
