import { env } from "@repo/env/server";
import jwt from "jsonwebtoken";

export interface PayloadSchema{
  id:string
};

export interface Input{
    payload:PayloadSchema,
    jwt_secret?:string,
    options?:jwt.SignOptions
}
export const signjwt = async (data:Input)=>{
  const token =  jwt.sign(data.payload,data.jwt_secret || env.JWT_SECRET,data.options)
  return token
}

export const verifyjwt = async (token:string)=>{
  const payload =  jwt.verify(token,env.JWT_SECRET) as PayloadSchema;
  return payload
}


// export const findAndReissueAccessToken = async (token:string)=>{
//   const newToken =  jwt.verify(token,env.JWT_SECRET);
//   return newToken;
// }

export const generateResetLink = async (email:string)=>{
  const token = await signjwt({payload:{id:email}});
  const reset_link = `${env.ALLOWED_ORIGINS}/reset-password?token=${token}`;
  return {token,reset_link}
}

