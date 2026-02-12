import jwt  from "jsonwebtoken"
import {config} from 'dotenv'
config()

export const verifyToken=async(req,res,next)=>{

    //read token from req
    let token=req.cookies.token
    //verify token validity
    if(token==undefined){
        return res.status(400).json({message:"Unauthorized req.Please Login"})
    }
    let decodedToken=jwt.verify(token,process.env.JWT_SECRET)
    //forward req
    next()
}