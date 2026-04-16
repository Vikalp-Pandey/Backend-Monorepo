import { MongoClient, Db, ObjectId } from 'mongodb';
import { withTimestamps } from '@repo/utils/db';
import { Verification } from '../schemas/verification';
import mongoose from 'mongoose';
import { env } from 'node:process';

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
  const Users = db.collection('users');
  // const Verification = db.collection('verification');

  mongoose.connect(url);
  // console.log("Database connected successfully");
  return {
    getUserByEmail: (email: string) => {
      return Users.findOne({ email });
    },
    getUserById: (id: string) => {
      return Users.findOne({ _id: new ObjectId(id) });
    },
    createUser: (email: string, password: string) => {
      const userData = withTimestamps({ email, password })
      return Users.insertOne(userData);
    },

    // 
    createOtp: async (email: string, otp: string) => {
      const data = {
        email, otp, type: 'otp'
      }

      await mongoose.connect(env.DATABASE_URL!)
      const resultOtp = await Verification.create(data);
      // console.log(resultOtp)
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


