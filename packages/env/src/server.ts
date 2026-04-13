import { createEnv } from '@t3-oss/env-core';

import { z } from '@repo/utils/zod';

export const env = createEnv({
  server: {
    // Environment
    ENVIRONMENT: z.enum(['development', 'staging', 'production']),

    // Database
    DATABASE_URL: z.url(),

    // Email
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().transform((val) => parseInt(val, 10)),
    SMTP_USERNAME: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_NAME: z.string(),
    SMTP_MAIL: z.string(),
    SMTP_REPLY_TO: z.string(),

    // API
    /** Auth */
    ALLOWED_ORIGINS: z
      .string()
      .transform((val) => val.split(',').map((origin) => origin.trim())),
    
    // COOKIE_DOMAIN: z.string(),
    /** App URLs */
    // API_URL: z.url(),
  },

  runtimeEnv: process.env,
});
