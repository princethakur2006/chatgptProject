import jwt from "jsonwebtoken";
import User from "../model/userSchema.js"
import bcrypt from "bcrypt"
import { signupSchema, loginSchema } from "../validators/userValidator.js";
import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";

const createToken = (id, email)=>{

    if(!process.env.JWT_SECRET){
        throw new Error("jwt secret key is missing");
    }


    const token = jwt.sign({id,email}, process.env.JWT_SECRET, {expiresIn:"1h"});
    return token ; 
}

const cookiesOption = {
    httpOnly: true, // js code will never able to read that cookie
    secure:false,   
    maxAge:60*601000 /// store max for 1 hour
}


export const signup = async(req, res)=>{
   try {

    // validate the data

    const result = signupSchema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            message:result.error.issues[0].message
        })
    }

    


    const {name, age, email, password}= result.data;
    
    const user =  await User.findOne({email});

    if(user){
        return res.status(409).json({
            message:"email is already exist"
        })
    }

    const hashPass = await bcrypt.hash(password, 12);

    const userCreated = await User.create({
        name,
        age, // if not given then i
        email,
        password:hashPass
    })

    // token create 

    const token = createToken(userCreated._id, email);

    res.cookie("token", token, cookiesOption);

    res.status(201).json({
        message:"user created successfully",
        name,
        age,
        email
    })





    // https status code 
   } catch (error) {
    console.log(error);
    res.status(500).json({
        message:"internal server error"
    })
   }
}

export const login = async(req, res)=>{ 
    try {
        const result = loginSchema.safeParse(req.body);

        
        if(!result.success){
        return res.status(400).json({
            message:result.error.issues[0].message
            })
        }



        const {email, password} = result.data;

       
        

        // verify the password
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                message:"invalid credentials"
            })
        }

        //match the pass 
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch){
            return res.status(401).json({
                message:"invalid credentials"
            })
        }

        const token = createToken(existingUser._id, email);

        res.cookie("token", token, cookiesOption);

        res.status(200).json({
            message:"user logged in successfully",
            name:existingUser.name,
            age:existingUser.age,
            email:existingUser.email,
            usage:existingUser.usage
        })


    } catch (error) {
        console.log(error),
        res.status(500).json({
            message:"internal sevrer error "
        });
        
    }
    

}

export const logout = async(req, res)=>{
    //logout 

    res.clearCookie("token", {
        httpOnly: true, // js code will never able to read that cookie
        secure:false,
    })

    res.status(200).json({
        message:"user logged out successfully "
    })
}

// profile ko sirf mein dekhu or koi nahi
// authentciated user:(wo srf apni hi profile ko access kar sakta hai): token hai laadle
// export const profile = async (req,res)=>{
//     try{
        
//         const {email} = req.body;

//         if(!email){
//             return res.status(400).json({
//                 message: "Email is missing"
//             })
//         }

//         const existingUser = await User.findOne({email});

//         if(!existingUser){
//             return res.status(401).json({message:"Invalide Email"})
//         }

//         res.status(200).json({
//             name:existingUser.name,
//             age: existingUser.age,
//             usage: existingUser.usage,
//             email: existingUser.email
//         })
//     }
//     catch(err){
        
//         console.log(err);
//         res.status(500).json({
//             message: "Internal Server error"
//         })

//     }
// }

export const profile = async(req,res)=>{
    try{
        // profile ki informat send karo
        // Database ke andar call kari padegi, us user ko search, _id, email
        res.status(200).json({
            name:req.user.name,
            age: req.user.age,
            usage: req.user.usage,
            email: req.user.email
        })

    }
    catch(err){

        console.log(err);
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}   

export const deleteUser = async(req,res)=>{
    try{
        // find all the chat id belongs to user

        // delete all the messages which belongs to the chat id => messages del using chat id

        // del all the chatId which belongs to this user=> del chatId using this user

        // del userProfile ; by his id 

        const userId = req.user._id;

        const chats = await Chat.find({ userId }).select("_id");
        
        const chatIds = chats.map((chat) => chat._id);
        
        await Message.deleteMany({
          chatId: { $in: chatIds }
        });
        
        await Chat.deleteMany({
          userId
        });
        
        await User.deleteOne({
          _id: userId
        });
        
        res.clearCookie("token", {
          httpOnly: true,
          secure: false,
          
        });
        
        res.status(200).json({
          message: "Account deleted successfully"
        });
        
    }catch(err){
        res.status(500).json({
        message: "Internal server error"

        })

}}







    
