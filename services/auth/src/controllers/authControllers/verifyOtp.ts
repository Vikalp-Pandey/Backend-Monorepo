import { DbAdapter } from "@repo/db/adapter";
import { Context } from "hono";
import { createCookie } from "../../handlers/handler";
import { signjwt } from "@repo/utils/jwt";

export const verifyOtp = (dbAdapter: DbAdapter) => {
    return async (c: Context) => {
    const {email, otp}= await c.req.json();
    const isValidOtp = await dbAdapter.verifyOtp(email,otp);
    if(!isValidOtp){
        return c.json({message:"Invalid Otp"})
    }
    const user = await dbAdapter.getUserByEmail(email);
    if(!user){
        return c.json({message:"User not found"});
    }
    const token = await signjwt({payload:{id:user!.id}})
    createCookie({token,tokenName:"accessToken"});
    return c.json({message:"User logged in successfully"})
}
}