import express from 'express';
import dotenv  from 'dotenv/config';
import connectDB from './config/database.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import cookieParser from 'cookie-parser';
import chatRouter from './routes/chatRouter.js';









const app =express();
app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.originalUrl);
    next();
});


app.use("/user", userRouter);
app.use("/message", messageRouter)
app.use("/chat", chatRouter)
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
        console.log(error);
        
    }
}

startServer();