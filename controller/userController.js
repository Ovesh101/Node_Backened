
import User from "../models/UserModel.js"
import { createJWT  } from "../utils/tokenUtils.js";


// import { createJWT } from "../utils/tokenUtils.js";

import { hashPassword  , comparePassword} from "../utils/passwordUtils.js"

const register = async (req , res)=>{

   
    req.body.password = await hashPassword(req.body.password);
    
   
    const user =await User.create(req.body)
    res.status(200).json({msg : "Register Successfully" , userInfo : user})
}



const login = async (req, res) => {
  // check if user exists
  
  // check if password is correct
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('User is not registered');
        console.log("user" , user);
      
        const isPasswordCorrect = await comparePassword(req.body.password , user.password);
        if (!isPasswordCorrect) throw new Error('Invalid password..');
        const token  = createJWT({userId : user._id })
        res.status(200).json({msg : "Login Successfully " , userInfo:user , token : token})
        
    } catch (error) {
        res.status(400).json({ msg: error.message , error:"Something ocucur while finding email" });
        
    }
 

//   const token  = createJWT({userId : user._id , role : user.role})

//   const oneDay = 1000*60*60*24;
//   res.cookie('token' , token , {
//     httpOnly : true,
//     expires : new Date(Date.now()+oneDay),
//     secure : process.env.NODE_ENV === 'production',
//   })


  
};



export {register , login}