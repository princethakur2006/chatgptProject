import jwt from "jsonwebtoken";
import User from "../model/userSchema.js"
import bcrypt from "bcrypt"
import { signupSchema, loginSchema } from "../validators/userValidator.js";

const createToken = ()=>{

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

    const result = signupSchema.safeparse(req.body);

    if(!result.success){
        return res.status(400).json({
            message:result.error.issues[0].message
        })
    }

    


    const {name, age, email, password}= result.data;
    
    const user =  await user.findOne({email});

    if(user){
        return res.status(409).json({
            message:"email is already exist"
        })
    }

    const hashPass = await bcrypt.hash(password, 12);

    const userCreated = User.create({
        name,
        age, // if not given then i
        email,
        password:hashPass
    })

    // token create 

    const token = createToken(userCreated._id, email);

    res.cookies("token", token, cookiesOption);

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
        const result = loginSchema.safeparse(req.body);

        
        if(!result.success){
        return res.status(400).json({
            message:result.error.issues[0].message
            })
        }



        const {email, password} = req.result;

       
        

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
            message:"user created successfully",
            name:existingUser.name,
            age:existingUser.age,
            email:existingUser.email,
            usage:existingUser.usage
        })


    } catch (error) {
        console.log(err),
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

export const profie = async(req,res)=>{
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








    
