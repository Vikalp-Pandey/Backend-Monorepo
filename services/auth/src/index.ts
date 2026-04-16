import { Hono } from "hono";
import { AuthConfig } from "./types/types";
import { signup } from "./controllers/authControllers/signup";
import { verifyOtp } from "./controllers/authControllers/verifyOtp";
import { signin } from "./controllers/authControllers/signin";
import { logout } from "./controllers/authControllers/logout";
import { resetPassword } from "./controllers/authControllers/resetPassword";
import { forgotPassword } from "./controllers/authControllers/forgotPassword";

export const createAuth = (config: AuthConfig) => {
  const authApp = new Hono()

  // authApp.get('/me',)
  authApp.post('/signup', signup(config.adapter));
  authApp.post('/signin',signin(config.adapter));
  authApp.post('/forgot-password',forgotPassword(config.adapter));
  authApp.post('/reset-password',resetPassword(config.adapter));
  authApp.post('/logout',logout(config.adapter));
  authApp.post('/verify-otp',verifyOtp(config.adapter));

  return authApp;
}

export default createAuth;





/*
---  Return Type 
function getUser() {
  return { id: 1, name: "Alice", isAdmin: true };
}

// Instead of manually writing: type User = { id: number; name: string; isAdmin: boolean; }
type User = ReturnType<typeof getUser>;

// Now 'User' is: { id: number; name: string; isAdmin: boolean; }

*/