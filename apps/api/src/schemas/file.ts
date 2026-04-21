
import { Document, model, Schema } from "mongoose";

export interface fileSchema {
   name:string,
   userId:string,
   size:string,
   key:string,
   mimeType:string,
   parentFolder?:string,
   fileUrl:string,
}

export interface fileInput extends fileSchema , Document {}

export const FileSchema = new Schema<fileInput>({
    name:{
        type:String,
        required:true,
    },
    userId: {
        type:String,
        ref:'User'
    },
    size:{
        type:String,
        required:true
    },
    key:{
        type:String,
        required:true
    },
    parentFolder:{
        type:String,
        default: null
    },
    mimeType:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    }

},{
    timestamps:true,
})

export const File = model<fileInput>('File',FileSchema);