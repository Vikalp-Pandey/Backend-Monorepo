import { Hono } from "hono";
import {  AuthConfig } from "./types/types";
import { signup } from "./controllers/authControllers/signup";
import { verifyOtp } from "./controllers/authControllers/verifyOtp";
import { signin } from "./controllers/authControllers/signin";
import { logout } from "./controllers/authControllers/logout";
import { resetPassword } from "./controllers/authControllers/resetPassword";
import { forgotPassword } from "./controllers/authControllers/forgotPassword";
import { githubCallback, githubLogin } from "./controllers/oauthControllers/github";
import { googleLogin,googleCallback } from "./controllers/oauthControllers/google";
import { me } from "./controllers/authControllers/me";

export const createAuth = (config: AuthConfig) => {
  const authApp = new Hono()

  authApp.get('/me', me(config.adapter));
  authApp.post('/signup', signup(config.adapter));
  authApp.post('/signin',signin(config.adapter));
  authApp.post('/forgot-password',forgotPassword(config.adapter));
  authApp.post('/reset-password',resetPassword(config.adapter));
  authApp.post('/logout',logout(config.adapter));
  authApp.post('/verify-otp',verifyOtp(config.adapter));

  authApp.get('/github',githubLogin(config.adapter));
  authApp.get('/callback/github',githubCallback(config.adapter));

  authApp.get('/google',googleLogin(config.adapter));
  authApp.get('/callback/google',googleCallback(config.adapter));

  return authApp;
}

export default createAuth;
