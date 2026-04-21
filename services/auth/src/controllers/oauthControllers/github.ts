import { DbAdapter } from "@repo/db/adapter";
import { env } from "@repo/env/server";
import axios from "axios";
import { Context } from "hono";
import { createCookie, handleAuthResponse } from "../../handlers/handler";
import { signjwt } from "@repo/utils/jwt";
import User from "@repo/db/schemas/user";

export const githubLogin = (db:DbAdapter)=>{
    return async (c:Context)=>{
        const githubURL = 'https://github.com/login/oauth/authorize';
        const params = new URLSearchParams({
            client_id: env!.GITHUB_CLIENT_ID,
            redirect_uri: env!.GITHUB_REDIRECT_URI,
            scope: 'user:email',
        }).toString();
        return c.redirect(`${githubURL}?${params}`);
    }
}

export const githubCallback = (db:DbAdapter)=>{
    return async (c:Context)=>{
        const { code }= c.req.query();
        if(typeof code !== 'string'){
            return c.json({message:"Code not found"},400);
        }
        const response = await axios.post('https://github.com/login/oauth/access_token',{
            client_id: env!.GITHUB_CLIENT_ID,
            client_secret: env!.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: env!.GITHUB_REDIRECT_URI,
        }, {
            headers: {
                Accept: 'application/json'
            }
        })

        const accessToken = response.data.access_token;

        if(!accessToken || typeof accessToken !== 'string'){
            return c.json({message:"Token not found or Invalid Token"},400);
        }

        const userResponse = await axios.get(`https://api.github.com/user`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = userResponse.data;

        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'Stripe-App',
            },
        });

        const email = emailResponse.data.find(
            (email: any) => email.primary && email.verified,
        ).email;

        const userData = {
            name: user.name,
            email: email,
            accessToken,
            twoFactorEnabled: false,
        };

        const isExisting = await User.findOne({email:email});
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

        // await db.createUser(userData.email);
        await User.create({name:userData.name,email:userData.email});
        const frontendState = await signjwt({
                   payload: { name: userData.name, email: userData.email }
            });
        const token = await signjwt({
            payload: { name: userData.name, email: userData.email }
        });
        createCookie({token, tokenName:'accessToken'})(c)

       return handleAuthResponse(c,isExisting,token,frontendState);;
    }
}

