import { Document, model, Schema } from "mongoose";

export interface verificationSchema {
    type :'otp' | 'reset_link',
    email:string,
    otp?:string,
    resetLink?:string,
    createdAt:Date
}

export interface verificationDocument extends verificationSchema, Document {}

export const VerificationSchema = new Schema<verificationSchema>({
    type: {
        type: String,
        enum: ['otp', 'reset_link'],
        required: true
    },
    email:{
        type:String,
        required:true
    },
    otp: {
        type: String,
        required: false
    },
    resetLink: {
        type: String,
        required: false
    },
    createdAt:{
        type:Date,
        default:Date.now,
        // expires: 300 // TTL
    }
},
{
    timestamps:true
}
);

export const Verification = model('Verification', VerificationSchema)