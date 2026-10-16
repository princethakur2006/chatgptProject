import express from 'express';
import authUserMiddleware from "../middlewares/authUserMiddleware.js"
import { getMessage, sendMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();


messageRouter.use(authUserMiddleware);

//get message, send message 

messageRouter.post("/", sendMessage);
messageRouter.get("/:chatId", getMessage);
messageRouter.post("/:chatId", sendMessage);

export default messageRouter;