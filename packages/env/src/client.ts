import { createEnv } from '@t3-oss/env-core';
import { z } from '@repo/utils/zod';

export const env = createEnv({
  clientPrefix: 'VITE_',

  client: {
    VITE_API_URL: z.string(),
  },

  runtimeEnv: import.meta.env,
});
