import 'express-async-errors';
import express  from 'express';
import mongoose from 'mongoose';
import UserRoute from "./routes/UserRoute.js"

import cookieParser from 'cookie-parser';
import dotenv from "dotenv"

import ProductRoute from "./routes/ProductRoute.js"
dotenv.config()

import cors from "cors"
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true  // Allows cookies to be sent and received
  }));


//  2nd method for implementing cors manually

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders : ["Content-type"]
// }))

app.get( '/', ( req, res ) => {
    res.send( 'Hello World!' );
})
app.use("/api/v1" , ProductRoute )
app.use("/api/v1" , UserRoute)


app.use(errorHandlerMiddleware);


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Database connected successfully');
    app.listen(3000, () => { console.log('Server is running on port 3000'); });

}).catch((error) => {

    console.log(error);


})