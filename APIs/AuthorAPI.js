import exp from 'express'
import { register,authenticate } from '../services/authService.js'
import { ArticleModel } from '../models/ArticalModel.js'
import { UserTypeModel } from '../models/UserModel.js'
import { checkAuthor } from '../middlewares/checkAuthor.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const authorRoute=exp.Router()

//Regist Author()
authorRoute.post('/users',async(req,res)=>{
    //get user object from req
    let authorObj=req.body
    //call register
    const newAuthorObj = await register({...authorObj,role:"AUTHOR"})
    //send response
    res.status(201).json({message: "Author created",payload:newAuthorObj})
})
//Create Article
authorRoute.post('/articles',checkAuthor,async(req,res)=>{
    //get article from req
    let article=req.body
    //check for author id
    // let authorizedAuthor= await UserTypeModel.findById(article.author)
    // if(!authorizedAuthor || authorizedAuthor.role!="AUTHOR"){
    //     res.status(401).json({message:"author is invalid"})
    // }
    //create article document
    let articleDoc=new ArticleModel(article)
    //save
    let published = await articleDoc.save()
    res.status(201).json({message:"Article published",payload:published})
})
//Read articles of author
authorRoute.get("/articles/:authorid",verifyToken,checkAuthor,async(req,res)=>{
    //get author id
    let aid=req.params.authorid
    //check for the author
    // let authorizedAuthor= await UserTypeModel.findById(aid)
    // if(!authorizedAuthor || authorizedAuthor.role!="AUTHOR"){
    //     res.status(401).json({message:"author is invalid"})
    // }
    //read articles of this author
    let articles=await ArticleModel.find({author:aid,isArticleActive:true}).populate({path:"author", select:"firstName email"})
    //send response
    res.status(201).json({message:"Articles are",payload:articles})
})
//Edit Article
authorRoute.put('/articles',verifyToken,checkAuthor,async(req,res)=>{
    //get the modified article
    let {author,articleid,title,content,category}=req.body
    //find article
    let oldarticle=await ArticleModel.findOne({_id:articleid,author:author})
    if(!oldarticle){
        res.status(404).json({message:"article does not exist"})
    }
    // if(author!=oldarticle.author){
    //     res.status(404).json({message:"Wrong Author"})
    // }
    //update the article
    let updatedArticle=await ArticleModel.findByIdAndUpdate(articleid,{
        $set:{title,category,content}
    },{new:true})
    //send res(updated article)
    return res.status(201).json({message:"Article Modified",payload:updatedArticle})
})
//Delete(Soft Delete) Article
authorRoute.put('/articles-delete',verifyToken, checkAuthor, async (req, res) => {
    // destructre
    let { author, articleid } = req.body

    // check if article exist
    let articleOfDB = await ArticleModel.findOne({ _id: articleid, author: author })
    if (!articleOfDB) {
        return res.status(404).json({ message: "Article not found" })
    }

    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleid, { $set: { isArticleActive: false } }, { new: true })

    // send response
    res.status(200).json({ message: "Article deleted", payload: updatedArticle })
})