import { UserTypeModel } from "../models/UserModel.js"
export const checkAuthor=async (req,res,next)=>{
    //get author id
    let aid = req.params.authorid ? req.params.authorid : req.body.author
    //let aid=req.params?.authorid || req.body?.author
    //verify author
    let authorizedAuthor=await UserTypeModel.findById(aid)
    //if author exists
    if(!authorizedAuthor){
        return res.status(401).json({message:"author is invalid"})
    }
    //if author role is not author
    if(authorizedAuthor.role!="AUTHOR"){
        return res.status(403).json({message :"User is not an Author"})
    }
    //check is author is active
    if(!authorizedAuthor.isActive){
        return res.status(403).json({message :"Author accout is deactivated"})
    }
    //forward req to next
    next()
}