const User=require('../models/user');
const {validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken') ;
exports.signup=async (req,res,next)=>{
    const errors=validationResult(req);
    try{
            if(!errors.isEmpty()){
            const error=new Error("Validation Failed");
            error.statusCode=422;
            error.data=errors.array();
            throw error;
            }
            const email=req.body.email;
            const name=req.body.name;
            const password=req.body.password;
            const hashedPassword=await bcrypt.hash(password,12);
            const user = new User({
                    email:email,
                    name:name,
                    password:hashedPassword
            });
            const result=await user.save();//result will contain user details after saving it in database
            res.status(201).json({message:"User Created SuccessFully ", userId:result._id});
            console.log("Sended RESPONSE")

        }
    catch(error){
            console.log("Error Occured at Login Controller");
            if(!error.statusCode){
                error.statusCode=500;
            }
            next(error);
        }
}


exports.login=async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    let loadedUser;
    try{
        const user=await User.findOne({email:email});
        if(!user){
            const error=new Error("User Not Exist");
            error.statusCode=401;
            throw error;
        }
        loadedUser=user;
        //check the given password with stored hash value of that password using compare method from bcryt
        const isMatch= await bcrypt.compare(password,loadedUser.password);//if true then
        if (!isMatch){//not match means wrong passsword entered by user so sending
            const error=new Error("Invalid Credentials");
            error.statusCode=401;
            throw error;
        }
        //creating a jwt token
        const token=jwt.sign({email:loadedUser.email,userId:loadedUser._id.toString()},'secret-key',{expiresIn:'1h'});
        //send a response with a status code 201
        res.status(201).json({token:token,userId:loadedUser._id.toString()});

    }
    catch(error){
        next(error)
    }
}
