
import User from "../models/UserModel.js"
import { createJWT  } from "../utils/tokenUtils.js";
import crypto from "crypto"
import { hashPassword  , comparePassword} from "../utils/passwordUtils.js"
import { sendEmail } from "../utils/sendEmail.js";
import { NotFoundError } from "../error/customError.js";

export const register = async (req , res)=>{

   
    req.body.password = await hashPassword(req.body.password);
    
   
    const user =await User.create(req.body)
    res.status(200).json({msg : "Register Successfully" , userInfo : user})
}



export const login = async (req, res) => {
  // check if user exists
  
  // check if password is correct
    try {

        console.log("");
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('User is not registered');
        console.log("user" , user);
      
        const isPasswordCorrect = await comparePassword(req.body.password , user.password);
        if (!isPasswordCorrect) throw new Error('Invalid password..');
        const token  = createJWT({userId : user._id })


           // Set the token in a cookie
        res.cookie('token', token, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript on the client side
        maxAge: 3600000   // 1 hour in milliseconds
      });
      res.cookie('username', user.name, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript on the client side
        maxAge: 3600000   // 1 hour in milliseconds
      });




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

export const logout = (req , res)=>{
    res.clearCookie('token');
    
    
    console.log(`-------> User Logged out`)
    res.json({ message: 'Logout successful' });


}

export const forgetPassword = async (req , res)=>{
    const {email} = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken =  crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${resetURL}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;


    await sendEmail(user.email , "Password reset Token" , message)

    console.log("before response");

    res.status(200).json({
        success:true,
        resetToken:resetToken,
        message:`Reset Token has been sent ${user.email}`
    })

}
export const resetPassword = async (req , res)=>{
    const {resetToken} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires:{
            $gt:Date.now()
        }
    })

    if(!user)throw new NotFoundError("Token is invalid or has been expired")
        console.log("changed"  ,req.body.password);

        req.body.password = await hashPassword(req.body.password);
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({
        success:true,
        password:user.password, // Hash password using 
        message:`Reset Token has been sent`,
        resetToken
    })
}



