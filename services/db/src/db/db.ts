import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDatabase(url: string): Promise<Db> {
  if (db) return db;

  if (!client) {
    // Connect Native Driver
    client = new MongoClient(url);
    await client.connect();
    
    // Connect Mongoose
    await mongoose.connect(url);
    
    console.log("Successfully connected to MongoDB (Native & Mongoose)");
  }

  db = client.db();
  return db;
}





