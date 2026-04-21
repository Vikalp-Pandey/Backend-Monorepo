import { DbAdapter } from "@repo/db/adapter";
import { env } from "@repo/env/server";
import axios from "axios";
import { Context } from "hono";
import { createCookie, handleAuthResponse } from "../../handlers/handler";
import { signjwt } from "@repo/utils/jwt";
import User from "@repo/db/schemas/user";

export const googleLogin = (db:DbAdapter)=>{
    return async (c:Context)=>{
          const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';
            const options = new URLSearchParams({
                redirect_uri: env!.GOOGLE_REDIRECT_URI,
                client_id: env!.GOOGLE_CLIENT_ID,
                access_type: 'offline',
                response_type: 'code',
                prompt: 'consent',
                scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                ].join(' '),
            }).toString();
            const googleOauthUrl = `${rootURL}?${options}`;
            return c.redirect(googleOauthUrl);
}}

export const googleCallback = (db:DbAdapter)=>{
    return async (c:Context)=>{
        const {code} = c.req.query();
        if(typeof code != 'string'){
            return c.json({message:"Invalid code"},400);
        }

        const tokenResponse = await axios.post(
               'https://oauth2.googleapis.com/token',
            {
            client_id: env!.GOOGLE_CLIENT_ID,
            client_secret: env!.GOOGLE_CLIENT_SECRET,
            grant_type: 'authorization_code', //Google’s OAuth 2.0 endpoint requires a grant_type parameter when exchanging a code for a token. If you omit it, the server will reject the request.
            code,
            redirect_uri: env!.GOOGLE_REDIRECT_URI,
            },
            {
            headers: { Accept: 'application/json' },
            },
        );
        const access_token = tokenResponse.data.access_token;
        const userResponse = await axios.get( 'https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userResponse.data;
        
        const userData = {
            name: user.name,
            email: user.email,
            accessToken: access_token,
            twoFactorEnabled: false,
        };

        const isExisting = await User.findOne({email:userData.email});
        if(isExisting){
            const frontendState = await signjwt({
                   payload: { name: isExisting.name, email: isExisting.email }
            });
            const token = await signjwt({
                payload: { name: isExisting.name, email: isExisting.email }
            });
            createCookie({token:token,tokenName:'accessToken'})(c)
            return handleAuthResponse(c,isExisting,token,frontendState);
        }

        // const newUser = await db.createUser(userData.email);
        const newUser = await User.create({name:userData.name,email:userData.email});
        const frontendState = await signjwt({
                   payload: { name: userData.name, email: userData.email }
            });
        const token = await signjwt({
            payload: { name: userData.name, email: userData.email }
        });
        createCookie({token, tokenName:'accessToken'})
        return handleAuthResponse(c,newUser,token,frontendState);
    }
}