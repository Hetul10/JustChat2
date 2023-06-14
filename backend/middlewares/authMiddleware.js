const jwt=require('jsonwebtoken');
const User=require("../models/userModel.js");
const asyncHandler=require('express-async-handler');

const access= asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(" ")[1];

            const decoded=jwt.verify(token,process.env.MERA_SECRET_TOKEN);
            req.user =await User.findById(decoded.id).select("-password");
            next();
        } catch(err){
            res.status(401);
            throw new Error("Sorry, you must be authorized to perform this action");
        }
    }
    else{
        res.status(401);
        throw new Error("Sorry, you must be authorized to perform this action");
    }
})

module.exports={access};