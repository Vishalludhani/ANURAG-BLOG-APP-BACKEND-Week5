import { Schema,model } from "mongoose";

const userSchema = new Schema({
    firstName:{
        type:String,
        required: [true,"First name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Enter valid password"]
    },
    profileImageUrl:{
        type:String
    },
    role:{
        type:String,
        enum: ["AUTHOR","USER","ADMIN"],//Check if the value is either of the enum values, if not, enum sends an error
        required:[true,"{value} is an Invalid Role"]
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    strict:true,
    versionKey:false
}) 

export const UserTypeModel=model("user",userSchema)