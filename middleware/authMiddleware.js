

import { verifyJWT } from "../utils/tokenUtils.js"

export const authenticateUser  = (req , res , next)=>{
    console.log("hello");
   const token = req.cookies.token;
   console.log("Token"  ,token);
   

    console.log("token" , token);
   
    try {
        if(!token) throw new Error("Authentication Invalid.....")
        const {userId } = verifyJWT(token)
       

        req.user ={userId}
        next()
    } catch (error) {
        res.status(400).json({ msg: "Authentication Invalid" , error:error.message});
    }

    
}



