// get recent top 20 chat, geTSingleChat, CreateChat, deleteCHat\
import Chat from "../model/chatSchema.js"

//req.user = user information in it  // last 20 chats 


export const getRecentChat = async(req, res)=>{
    try {
        const chats = await Chat.find({userId:req.user._id})
                                    .select("topic updatedAt")
                                    .sort({updatedAt: -1 })
                                    .limit(20);

        res.status(200).json({
            messsage:"all recent chats",
            chats
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message:"internal server error"
        })
        
    }

}

export const getSingleChat = async(req, res)=>{
    try {
        const {chatId} = req.params;
        const chat = chat.findOne({_iid:chatId, userId: req.user._id})

        if(!chat){
            return res.status(404   ).json({
                message:"bad request"
            })
        }

        res.status(200).json({
            chatId: chat._id,
            userId: chat.userId,
            topic: chat.topic,
            usage:chat.usage
        })

    } catch (error) {
        console.log(err);
        res.status(500).json({
            message:"internal server error"
        })
        
    }

}

export const createChat = async(req, res)=>{
    try {
        const {model} = req.body;

        if(!model){
            return res.status(400).json({
                message:"model name is missing"
            })
        }

        const chatCreated = await Chat.create({
            userId: req.user._id,
            model,
        })

        res.status(201).json({
            chatId: chatCreated._id,
            userId: req.user._id,
            model,
            topic: chatCreated.topic,
            createdAt:chatCreated.createdAt
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message:"internal server error"
        })
        
    }
    
}

export const deleteChat = async(req, res)=>{
    try {
        const {chatId} = req.params;


        // MongoDB checks both conditions:
        //     - Does the chat ID equal "chat101"? Yes.
        //     - Does the chat belong to "userA"? Yes.

        const chat = await Chat.findOne({_id:chatId, userId: req.user._id});

        if(!chat){
            return res.status(403).json({
                message:"unauthorized access"
            })
        }

        await Message.deleteMany({
            chatId: chat._id
        })

        await Chat.deleteOne({
            _id: chatId
        });


        res.status(200).json({
            message:"your chat has been deleted successfully"
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message:"internal server error"
        })
        
    }
    
}

