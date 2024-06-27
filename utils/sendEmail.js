/* eslint-disable no-undef */
import { createTransport} from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

export const sendEmail = async (to , subject , text)=>{
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    await transporter.sendMail({
        to,
        subject,
        text,
        
    })
}