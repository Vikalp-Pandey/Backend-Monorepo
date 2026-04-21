import { Model } from "mongoose";

export const  withTimestamps = (data: any) => ({
  ...data,
  createdAt: data.createdAt || new Date(),
  updatedAt: new Date(),
});

export const createInstance = (model:Model<any>,parameters:any)=>{
  const instance = model.create(parameters);
  return instance;
}