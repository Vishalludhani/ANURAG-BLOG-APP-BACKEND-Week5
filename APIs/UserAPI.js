import exp from 'express'
import { register } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkUser } from '../middlewares/checkUser.js'
import { ArticleModel } from '../models/ArticalModel.js'

export const userRoute=exp.Router()


//Resgister user(Public Route)
userRoute.post('/users',async(req,res)=>{
    //get user object from req
    let userObj=req.body
    //call register
    const newUserObj = await register({...userObj,role:"USER"})
    //send response
    res.status(201).json({message: "User created",payload:newUserObj})
})
//Read all articles(Protected Route)
userRoute.get('/read-articles/:userid',verifyToken,checkUser,async(req,res)=>{
    //get userid
    let uid=req.params.userid;
    //check if role user or author
    //read all articles
    let articles=await ArticleModel.find()
    res.status(200).json({message:"Articles are:",payload:articles})
})
//Add comment to an article(Protected Route)
userRoute.put('/comments/:articleid',verifyToken,checkUser,async(req,res)=>{
    let {user,comment} = req.body
    let aid=req.params.articleid
    console.log(aid)
    let article=await ArticleModel.findByIdAndUpdate(aid,{
        $push : {comments:{user,comment}}},
        {new:true}).populate()
    console.log(article)
    res.status(200).json({message:"comment added",payload:article})
})