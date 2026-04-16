import { randomInt } from "crypto";

export const generateOTP = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    // randomInt is more secure than Math.random() for auth tokens
    otp += randomInt(0, 10).toString();
  }
  return otp;
};