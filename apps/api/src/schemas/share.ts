import { model, Schema } from "mongoose"

export interface shareItemSchema{
    fileId?:string,
    folderId?:string,
    userId:string, // destination user Id
    sharedBy: string,
    permissions:string[]
}

export interface shareItemInput extends shareItemSchema,Document{}

export const shareItemsSchema = new Schema<shareItemInput>({
    fileId:{
        type:String,
        ref:'File'
    },
    folderId:{
        type:String,
        ref:'Folder'
    },
    userId:{
        type:String,
        ref:'User'
    },
    sharedBy: {
      type: String,
      ref: 'User',
      required: true,
    },
    permissions:{
        type:[String],
        required:true
    }
},{
    timestamps:true
})

export const ShareItem = model<shareItemInput>('ShareItem',shareItemsSchema)