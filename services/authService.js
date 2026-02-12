import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserTypeModel } from "../models/UserModel.js"
import {config} from 'dotenv'
config()

export const register = async (userObj) => {
    //create document
    const userDoc = new UserTypeModel(userObj)
    //validate for empty password
    await userDoc.validate()
    //hash and replace plain password
    userDoc.password = await bcrypt.hash(userDoc.password, 10)
    //save
    const created = await userDoc.save()
    //convert document to object to remove password
    const newUserObj = created.toObject()
    //remove password
    delete newUserObj.password
    //return the user obj without the password
    return newUserObj
}

export const authenticate = async ({ email, password}) => {
    //check user mail and role
    const userDoc = await UserTypeModel.findOne({ email})
    if (!userDoc) {
        const err = new Error("Invalid Email")
        err.status = 401
        throw err
    }
    //if user is valid but blocked by admin


    //compare passwords
    const isMatch = await bcrypt.compare(password, userDoc.password)
    if (!isMatch) {
        const err = new Error("Invalid Password")
        err.status = 401
        throw err
    }
    //check is user is blocked or not
    if(!userDoc.isActive){
        const err = new Error("User is Blocked")
        err.status(403)
        throw err
    }

    //generate the token
    const token = jwt.sign({ userId: userDoc._id, role: userDoc.role, email: userDoc.email },
        process.env.JWT_SECRET, {
        expiresIn: "1h"
    })

    const userObj = userDoc.toObject();
    delete userObj.password;

    return { token, user: userObj }
}