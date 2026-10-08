import express from 'express';
import connectDB from './config/database';
import dotenv  from 'dotenv';
import userRouter from './routes/userRouter';
import messageRouter from './routes/messageRouter';
import cookieParser from 'cookie-parser';




dotenv.config();




const app =express();
app.use(express.json());
app.use(cookieParser());


app.use("/user", userRouter);
app.use("message", messageRouter)
//login, signup, logout , profile:user related

// chat api 

// message api 


const startServer = async ()=>{
    try {
        await connectDB();

        app.listen(process.env.PORT, ()=>{
        console.log(`server has started listeneig on port ${process.env.PORT} `);
        })
    } catch (error) {
        console.log(err);
        
    }
}

startServer();