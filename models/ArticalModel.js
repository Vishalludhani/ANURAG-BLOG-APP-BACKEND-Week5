import { Schema,model } from "mongoose";
//create user comment schema
const userCommentSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:user
    },
    comment:{
        type:String
    }
})

//create article schema
const articleSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Author ID required"]
    },
    title:{
        type:String,
        required:[true,"Enter the title"]
    },
    category:{
        type:String,
        required:[true,"Enter the category"]
    },
    content:{
        type:String
    },
    commnets: [userCommentSchema],
    isArticleActive:{
        type:Boolean,
        deafault:true
    }
},{
    timestamps:true,
    strict:true,
    versionKey:false
})

export const ArticleModel=model("article",articleSchema)