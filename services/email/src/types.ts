interface EmailVerification {
  type: 'emailVerification';
  data: {
    name: string;
    url: string;
  };
}

interface ResetPassword {
  type: 'resetPassword';
  data: {
    name: string;
    url: string;
  };
}

interface AccountApproved {
  type: 'accountApproved';
  data: {
    name: string;
    email: string;
    loginUrl: string;
  };
}

interface AccountCreated {
  type: 'accountCreated';
  data: {
    name: string;
    email: string;
    password: string;
    loginUrl: string;
  };
}

export type MailTemplate =
  | EmailVerification
  | ResetPassword
  | AccountApproved
  | AccountCreated;

export interface SendMail {
  to: string;
  subject: string;
  template: MailTemplate;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}
