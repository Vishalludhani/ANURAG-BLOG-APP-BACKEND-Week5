import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
config()
const app = exp()
//add body parser middleware
app.use(exp.json())

const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB Connection success")
        //start http server
        app.listen(process.env.PORT,()=>console.log("server started"))
    }catch(err){
        console.log("err in DB connection",err)
    }
}

connectDB()

app.use('/user-api',userRoute)
app.use('/admin-api',adminRoute)
app.use('/author-api',authorRoute)

//error handling middleware
app.use((err,req,res,next)=>{
    res.json({message: "error",reason:err.message})
})