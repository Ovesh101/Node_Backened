import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"

 export const createJWT =   (payload)=>{
    const token = jwt.sign(payload , "secret" ,{expiresIn : "1h"});
    console.log(token);
    return token
}

export const verifyJWT = (token)=>{
    const decoded = jwt.verify(token , "secret");
    return decoded
}

