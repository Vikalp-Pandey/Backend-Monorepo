import { generateOTP } from "@repo/utils/otp";
import { Context } from "hono"
import { emailService } from "../../services/email.service";
import { env } from "@repo/env/server";
import { DbAdapter } from "@repo/db/adapter";

export const forgotPassword = (db:DbAdapter)=>{
    return async (c:Context)=>{
        const {email}= await c.req.json();
        const user = await db.getUserByEmail(email);
        if(!user){
            return c.json({message:"User with this email not Found"})
        }
         await emailService.sendEmail({
            to:email,
            subject:"Forgot Password",
            template:{
                type:"resetPassword",
                data:{
                    name:user.name,
                    url:`${env.ALLOWED_ORIGINS}/reset-password`
                }
            }  
         });

         return c.json({message:"Reset Password Link is sent to your email."})
    }
}