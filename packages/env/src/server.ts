import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

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
    JWT_SECRET:z.string(),
    GITHUB_CLIENT_ID:z.string(),
    GITHUB_CLIENT_SECRET:z.string(),
    GITHUB_REDIRECT_URI:z.string(),
    GOOGLE_CLIENT_ID:z.string(),
    GOOGLE_CLIENT_SECRET:z.string(),
    GOOGLE_REDIRECT_URI:z.string(),
    AWS_ACCESS_KEY_ID:z.string(),
    AWS_SECRET_ACCESS_KEY:z.string(),
    AWS_REGION:z.string(),
    BUCKET_NAME:z.string(),
  },

  runtimeEnv: process.env,
});
