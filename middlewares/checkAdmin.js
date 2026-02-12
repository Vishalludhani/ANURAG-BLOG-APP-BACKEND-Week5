import { UserTypeModel } from "../models/UserModel.js"

export const checkAdmin = async(req,res,next)=>{
    //get user id
    let aid=req.params?.userid || req.body?.user
    //check if user is there
    let authorizedAdmin=await UserTypeModel.findById(aid)
    //if user does not exist
    if(!authorizedAdmin){
        return res.status(401).json({message:"User does not exist"})
    }
    //if user role is not user
    if(authorizedAdmin.role!="ADMIN"){
        return res.status(404).json({message:"Not an admin"})
    }
    //send req
    next()
}