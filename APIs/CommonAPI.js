import exp from 'express'
import { authenticate } from '../services/authService.js'
import { UserTypeModel } from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
export const commonRoute=exp.Router()

//login
commonRoute.post("/login",async(req,res)=>{
    //get user credentials
    let userCred=req.body
    // call authenticate service
    let {token,user} = await authenticate(userCred)
    //save token as httpOnly Cookie
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    })
    res.status(200).json({message:"Login successful",payload:user})
})

//logout
commonRoute.get('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
        sameSite:'lax'
    })

    res.status(200).json({message:"Logged Out Successfully"})
})

commonRoute.put('/change-password',async(req,res)=>{
    let {email,oldp,newp}=req.body
    let user=await UserTypeModel.findOne({email:email})
    console.log(user.password)
    let authorizedUser = await bcrypt.compare(oldp,user.password)
    if(!authorizedUser){
        return res.status(404).json({message:"Invlid password, check again"})
    }
    let hashedpassword= await bcrypt.hash(newp,10)
    let updatedUser=await UserTypeModel.findByIdAndUpdate(user._id,{
        $set : {password:hashedpassword}},
        {new:true}
    )
    return res.status(201).json({message:"Password Updated Successfully"})
})