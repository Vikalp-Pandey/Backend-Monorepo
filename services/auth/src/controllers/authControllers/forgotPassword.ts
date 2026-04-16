import { generateOTP } from "@repo/utils/otp";
import { Context } from "hono"
import { emailService } from "../../services/email.service";
import { env } from "@repo/env/server";
import { DbAdapter } from "@repo/db/adapter";
import { generateResetLink } from "@repo/utils/jwt";
import { Verification } from "../../../../db/src/schemas/verification";

export const forgotPassword = (db:DbAdapter)=>{
    return async (c:Context)=>{
        const {email}= await c.req.json();
        const user = await db.getUserByEmail(email);
        if(!user){
            return c.json({message:"User with this email not Found"})
        }

        const {token,reset_link}= await generateResetLink(email);
         await emailService.sendEmail({
            to:email,
            subject:"Forgot Password",
            template:{
                type:"resetPassword",
                data:{
                    name:user.name,
                    url:reset_link
                }
            }  
         });

         await Verification.create({
            type:'reset_link',
            email,
            token,
            resetLink:reset_link
         });
         
         return c.json({message:"Reset Password Link is sent to your email."})
    }
}