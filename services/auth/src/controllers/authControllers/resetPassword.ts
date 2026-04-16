import { DbAdapter } from "@repo/db/adapter";
import { Context } from "hono";
import bcrypt from "bcrypt";

export const resetPassword = (db:DbAdapter)=>{
   return async (c:Context)=>{
     const {email,password}=await c.req.json();
     const hashedPassword= await bcrypt.hash(password,10);
     const user = await db.getUserByEmail(email);
     if(!user){
        return c.json({message:"User with this email not exists"});
     }
     user.password = hashedPassword;
     await user.save();
     return c.json({message:"Password Reset Successfully"})
   }
}

