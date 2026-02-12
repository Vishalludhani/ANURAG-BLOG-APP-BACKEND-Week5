import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkAdmin } from '../middlewares/checkAdmin.js'
import { ArticleModel } from '../models/ArticalModel.js'
import { UserTypeModel } from '../models/UserModel.js'

export const adminRoute=exp.Router()

//Read all articles
adminRoute.get('/read-articles/:userid',verifyToken,checkAdmin,async(req,res)=>{
    //get userid
    //let aid=req.params.userid;
    //check if role user or author
    //read all articles
    let articles=await ArticleModel.find()
    res.status(200).json({message:"Articles are:",payload:articles})
})
//Block user roles
adminRoute.get('/block-user/:uid',async(req,res)=>{
    let userId=req.params.uid
    let blockedUser=await UserTypeModel.findByIdAndUpdate(userId,{
        $set : {isActive:false}},
        {new:true}
    )
    return res.status(201).json({message:"User is Blocked",payload:blockedUser})
})

//unblock user roles
adminRoute.get('/unblock-user/:uid',async(req,res)=>{
    let userId=req.params.uid
    let unblockedUser=await UserTypeModel.findByIdAndUpdate(userId,{
        $set:{isActive:true}},
        {new:true}
    )
    return res.status(201).json({message:"User Unblocked",payload:unblockedUser})
})