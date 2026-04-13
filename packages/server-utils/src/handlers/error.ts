import { ErrorName } from '@repo/server-utils/errors/constants';
import HttpError from '@repo/server-utils/errors/http-error';

import type { Context } from 'hono';

export default function onError(error: Error, ctx: Context) {
  if (error instanceof HttpError) {
    return ctx.json(error.toResponseJSON(), error.statusCode);
  }

  return ctx.json(
    {
      success: false,
      message: 'Something went wrong',
      error: ErrorName.INTERNAL_SERVER,
      stack: error.stack,
    },
    500,
  );
}
