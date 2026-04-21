/*
For Packages we use adapters rather than normal schema because our servers can use different dbs that's why the adapter takes only db instance as argument.
*/
export interface AuthAdapter{
  createUser : (name:string, email:string, passwordHash?:string)=> Promise<any | null>;
  getUserByEmail: (email:string)=>Promise<any | null>;
  getUserById: (id:string)=>Promise<any | null>;
  createOtp: (email:string, otp:string)=>Promise<any>;
  verifyOtp: (email:string, otp:string)=>Promise<boolean>;
}

export interface AuthConfig {
    adapter: AuthAdapter,
    jwtSecret: string
}

