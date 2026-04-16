import { Context } from "hono";
// import { db } from '@repo/db/db';
import { DbAdapter } from "@repo/db/adapter";
import bcrypt from 'bcrypt';
import { emailService } from "../../services/email.service";
import type { MailTemplate } from "@services/email/types";
import { generateOTP } from "@repo/utils/otp";


export const signup = (dbAdapter: DbAdapter) => {
  return async (c: Context) => {
    // Now 'c' is the first argument passed by Hono otherwise while destructuring c.req.json() would have thrown an error of undefined while reading properties.
    const { name, email, password } = await c.req.json();

    const isExisting = await dbAdapter.getUserByEmail(email);
    if (isExisting) {
      return c.json({ message: "User already exists" }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(6);
    await dbAdapter.createOtp(email, otp);
   
    await emailService.sendEmail({
      to: email,
      subject: "Email Verification for Signup",
      template: {
        type: 'emailVerification',
        data: {
          name,
          otp
        }
      } as MailTemplate
    });
    const newUser = await dbAdapter.createUser(email, hashedPassword);
    return c.json({ message: "An Otp is send for Email Verification", newUser }, 200);
  };
};



