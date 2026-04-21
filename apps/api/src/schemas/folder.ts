import { Document,model,Schema } from "mongoose";

export interface folderSchema{
name:string,
userId:string,
parentFolder?:string,
}
export interface folderInput extends folderSchema,Document{}

export const FolderSchema = new Schema<folderInput>({
name:{
    type:String,
    required:true
},
userId:{
    type:String,
    ref:'User'
},
parentFolder:{
    type:String,
    required:false,
    default: null
}
},{
    timestamps:true
})

export const Folder =  model<folderInput>('Folder',FolderSchema);