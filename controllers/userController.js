export const login = async(req, res)=>{
    

}

export const logout = async(req, res)=>{
    
}

export const signup = async(req, res)=>{
    const {name, age , email , password} = req.body;

    const hashPassword = await bcrypt.hash(password, 12);

    const u = await User.create({
        name, age, email, password:hashPassword
    })


    // token bhejna padega 

    //payload(no sensitive data here), secret key , optional field
    

    // token creation
    const token = jwt.sign({
        email:email,
        name:name
    },
    "rohit@456" , //=> seceret key
    {expiresIn:"1h"}
    )
    
    //browser se baat
    res.cookie("token",token, {
        httpOnly:true,  //tells browser dont give access to frontend document.cookie
        secure:false,   // if true then browser got the indication if the website then it means website will be on https 
        maxAge:60*60*1000 // milisecod  indication to browser

    })

    //expires in tell when the token is created and when will it will be expired
    res.json({
        message:"user profile is created"
    })
}

export const profile = async(req, res)=>{
    
    //verify its token 

    const {token} = req.cookies;

    // verify this token its valid or not 

    const payload = jwt.verify(token, "rohit@456"); //return the payload 

    const user = await User.findOne({email: payload.email})

    if(user){
        res.json({
        message:"your user detail",
        data: user
        })
    }else{
        res.json({
            message:"user is not found"
        })
    }

}








    
