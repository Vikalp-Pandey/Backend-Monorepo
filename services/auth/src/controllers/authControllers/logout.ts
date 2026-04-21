import { DbAdapter } from "@repo/db/adapter";
import { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

export const logout = (db:DbAdapter)=>{
return async (c:Context)=>{
    const access_token = getCookie(c,'accessToken');
    if(access_token){
        deleteCookie(c,"accessToken");
        return c.json({message:"User Logged out Successfully"},200)
    }
    return c.json({message:"User is not logged in"},200)
}}