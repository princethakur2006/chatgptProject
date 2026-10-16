

 import express from "express"
 import authUserMiddleware from "../middlewares/authUserMiddleware.js";
 import { getSingleChat, createChat, getRecentChat, deleteChat } from "../controllers/chatController.js";

 const chatRouter = express.Router();

 chatRouter.use(authUserMiddleware);

chatRouter.post("/createChat",createChat);
chatRouter.get("/getRecentChat", getRecentChat);
chatRouter.get("/:chatId", getSingleChat);   // we are not showing this to user
chatRouter.delete("/:chatId", deleteChat);


export default chatRouter;