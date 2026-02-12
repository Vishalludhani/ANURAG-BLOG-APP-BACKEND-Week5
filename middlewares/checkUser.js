import { UserTypeModel } from "../models/UserModel.js"

export const checkUser = async(req,res,next)=>{
    //get user id
    let uid=req.params?.userid || req.body?.user
    //check if user is there
    let authorizedUser=await UserTypeModel.findById(uid)
    //if user does not exist
    if(!authorizedUser){
        return res.status(401).json({message:"User does not exist"})
    }
    //if user role is not user
    if(authorizedUser.role!="USER"){
        return res.status(404).json({message:"Author detected"})
    }
    //if user is blocked
    if(!authorizedUser.isActive){
        return res.status(404).json({message:"User is blocked"})
    }
    //send req
    next()
}