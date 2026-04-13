import { ErrorName } from '@repo/server-utils/errors/constants';

import type { Context } from 'hono';

export default function notFound(c: Context) {
  return c.json(
    {
      success: false,
      message: `Route ${c.req.path} not found`,
      error: ErrorName.NOT_FOUND,
    },
    404,
  );
}
