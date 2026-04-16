import { DbAdapter } from "@repo/db/adapter";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import {verifyjwt} from "@repo/utils/jwt";
export const validateUser = (db:DbAdapter)=>{
    return async (c:Context, next:Next)=>{
        const accessToken = getCookie(c,'accessToken');
        if(!accessToken){
            return c.json({message:"UnAuthenticated User"},401);
        }

        const payload = await verifyjwt(accessToken);
        if(!payload){
            return c.json({message:"Invalid Token"},401);
        }
        const user = await db.getUserById(payload.id);
        if(!user){
            return c.json({message:"User not found"},404);
        }
        c.set('user',user);

        return next();
    }
}