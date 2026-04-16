import { DbAdapter } from "@repo/db/adapter";
import { Context } from "hono";
import bcrypt from 'bcrypt';
import { getCookie, setCookie } from "hono/cookie";
import { signjwt } from "@repo/utils/jwt";

export const signin = (db:DbAdapter)=>{
  return async (c:Context)=>{
      const {email,password}= await c.req.json();
      const user = await db.getUserByEmail(email);
      const isPasswordValid = await bcrypt.compare(password,user?.password);
      if(!isPasswordValid){
        return c.json({message:"Invalid Password"})
      }

      const accessToken = getCookie(c,'accessToken');
      if(!accessToken){
         if(!user){
            return c.json({message:"User not found"}, 404);
         }
         const token = await signjwt({payload:{id:user.id}});
         setCookie(c,'accessToken',token)
         return c.json({message:"User Logged In Successfully"})
      }
      return c.json({message:"Already Logged In"});      
  }
}