import { env } from '@repo/env/server';

import EmailService from '@services/email';

export const emailService = new EmailService(
  env.SMTP_NAME,
  env.SMTP_MAIL,
  env.SMTP_REPLY_TO,
  env.SMTP_HOST,
  env.SMTP_PORT,
  env.SMTP_USERNAME,
  env.SMTP_PASSWORD,
);
