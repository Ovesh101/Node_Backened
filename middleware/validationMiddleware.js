
import { body ,  validationResult } from "express-validator";
import User from "../models/UserModel.js"

import { BadRequestError, NotFoundError } from "../error/customError.js";

const withValidationError = (validateValues)=>{
    return [
        validateValues,
        (req , res , next)=>{
            const errors = validationResult(req);
            console.log(errors);
            if(!errors.isEmpty()){
              const errorMessage = errors.array().map((error)=>error.msg)

          
              if(errorMessage[0].startsWith('Not Authorized')){
                throw new NotFoundError(errorMessage)
              }

              throw new BadRequestError(errorMessage)
            }
            next();
        }
    ]
}

export const validateLoginInput = withValidationError ([
    
    body('email')
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('invalid email format'),
    body('password').notEmpty().withMessage('password is required'),
  ]);


export const validateRegisterInput = withValidationError([
    body('name').notEmpty().withMessage('Please Provide name').isLength({min:4 , max : 20}).withMessage("Name must be atleast 4 character long...").matches(/^[a-zA-Z]+$/)
    .withMessage('Name must contain only letters'),
    body('email').notEmpty().withMessage('Please Provide Email').isEmail().withMessage("Invalid Email").custom( async (email)=>{
        const user = await User.findOne({email})
        if(user){
            throw new BadRequestError("Email already exist..")
        }
    }),
    body('password').notEmpty().withMessage('Please Provide name').isLength({min:8 }).withMessage("Password must be atleast 8 character long.."),
    // body('role').isIn(Object.values(ROLE)).withMessage("Invalid  Credentials..")
])


export const validatePaymentForm = withValidationError([
    body('firstName').notEmpty().withMessage('Please Provide First Name').isLength({min:4 , max : 20}).withMessage("First Name must be atleast 4 character long...").matches(/^[a-zA-Z]+$/)
    .withMessage('First Name must contain only letters'),

    body('lastName').notEmpty().withMessage('Please Provide Last Name').isLength({min:4 , max : 20}).withMessage("Last Name must be atleast 4 character long...").matches(/^[a-zA-Z]+$/)
    .withMessage('Last Name must contain only letters'),

    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),

    body('address')
          .notEmpty().withMessage('Please Provide Address')
          .isLength({ min: 5, max: 100 }).withMessage("Address must be at least 5 characters long and at most 100 characters long")
          .matches(/^[a-zA-Z0-9\s,.'-]*$/).withMessage('Address must contain only letters, numbers, spaces, and the following characters: , . \' -')


   
    // body('role').isIn(Object.values(ROLE)).withMessage("Invalid  Credentials..")
])


