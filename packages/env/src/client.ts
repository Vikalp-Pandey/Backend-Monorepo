import { createEnv } from '@t3-oss/env-core';
import { z } from '@repo/utils/zod';

export const env = createEnv({
  clientPrefix: 'VITE_',

  client: {
    VITE_API_URL: z.url(),
    VITE_USER_APP_URL: z.url(),
    VITE_ADMIN_APP_URL: z.url(),
    VITE_SUPABASE_URL: z.url(),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
  },

  runtimeEnv: import.meta.env,
});
