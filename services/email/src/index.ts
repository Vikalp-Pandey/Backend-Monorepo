// Node Modules
import { render } from '@react-email/render';
import { createTransport } from 'nodemailer';

// Templates
import {
  // AccountApproved,
  // AccountCreated,
  EmailVerification,
  ResetPassword,
} from './templates/auth.templates';

import type { Transporter } from 'nodemailer';
import type { MailTemplate, SendMail } from './types';

export default class EmailService {
  private name: string;
  private mail: string;
  private replyTo: string;
  private transporter: Transporter;

  constructor(
    name: string,
    mail: string,
    replyTo: string,
    host: string,
    port: number,
    username: string,
    password: string,
  ) {
    this.transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: username,
        pass: password,
      },
    });

    this.name = name;
    this.mail = mail;
    this.replyTo = replyTo;
  }

  async getTemplate(template: MailTemplate) {
    switch (template.type) {
      case 'emailVerification':
        return await render(EmailVerification(template.data));
      case 'resetPassword':
        return await render(ResetPassword(template.data));
      // case 'accountApproved':
      //   return await render(AccountApproved(template.data));
      // case 'accountCreated':
      //   return await render(AccountCreated(template.data));
    }
  }

  async sendEmail(args: SendMail) {
    await this.transporter.sendMail({
      from: {
        name: this.name,
        address: this.mail,
      },
      replyTo: this.replyTo,
      to: args.to,
      subject: args.subject,
      html: await this.getTemplate(args.template),
    });
  }
}
