import User from '@repo/db/schemas/user';
import { Verification } from '@repo/db/schemas/verification';
import { MongoClient, Db } from 'mongodb';
// import { Verification } from '@db/schemas/verification';
import mongoose from 'mongoose';
// import User from 'db/schemas/user';

let client: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDatabase(url: string): Promise<Db> {
  if (cachedDb) return cachedDb;
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
    await mongoose.connect(url);
    console.log("Database connected successfully");
  }
  cachedDb = client.db();
  return cachedDb;
}

export const createDbAdapter = (db: Db, url:string) => {
  mongoose.connect(url);
  // console.log("Database connected successfully");
  return {
    getUserByEmail: (email: string) => {
      // exec() is used to execute the query. If exec() is not used, it will return a mongoose Query object which is thenable but not a promise
      return User.findOne({ email }).exec();
    },
    getUserById: (id: string) => {
      return User.findById(id).exec();
    },
    createUser: (name:string, email: string, password?: string) => {
      return User.create({name,email,password});
    },

    // 
    createOtp: async (email: string, otp: string) => {
      const data = {
        email, otp, type: 'otp'
      }

      const resultOtp = await Verification.create(data);
      return resultOtp
    },

    verifyOtp: async (email:string, otp: string) => {
      const isExisting = await Verification.findOne({ otp,email });
      if (!isExisting) {
        return false
      }
      return isExisting.otp! === otp;
    },
  };
};

const getDbInstance = async (url: string) => {
  const db = await getDatabase(url);
  return createDbAdapter(db,url);
}


export type DbAdapter = ReturnType<typeof createDbAdapter>;

export default getDbInstance;


