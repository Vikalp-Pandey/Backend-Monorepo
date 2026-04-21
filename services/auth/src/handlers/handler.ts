import { Context } from "hono";
import { CookieOptions } from "hono/utils/cookie";
import { setCookie } from "hono/cookie";
import { env } from "@repo/env/server";

interface CookieConfig {
    token: string,
    tokenName:string,
    options?: CookieOptions
}

export const createCookie = (config: CookieConfig) => {
    return (c: Context) => {  
        // setCookie(context, name, value, options)  
        setCookie(c,config.tokenName,config.token, {
            httpOnly:true,
            secure: env.ENVIRONMENT === 'production',
            sameSite: env!.ENVIRONMENT === 'production' ? 'none' : 'lax',
            maxAge:1000*60*60,
            ...config.options });
        // return c.json({message:"Cookie set successfully"},200);
    }
}

const cookieConfig = {
  isSecure: env!.ENVIRONMENT === 'production',
  sameSite: env!.ENVIRONMENT === 'production' ? 'none' : 'lax',
} 

export const handleAuthResponse = (
  c:Context,
  user: any,
  token: string | undefined,
  frontendState: string,
) => {
  const isProduction = env!.ENVIRONMENT === 'production';
  // if (isProduction==false) {
  //   return c.json({
  //     message: 'Production Mode: Frontend not ready, returning JSON.',
  //     user, // Returns the full user field as requested
  //     token,
  //     frontendState,
  //   });
  // }

  return c.redirect(
    `${env!.ALLOWED_ORIGINS}/dashboard?state=${frontendState}`,
  );
};