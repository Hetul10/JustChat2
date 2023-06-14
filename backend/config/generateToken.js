const jwt=require('jsonwebtoken');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.MERA_SECRET_TOKEN,{
        expiresIn:'60d'
    });
}

module.exports=generateToken;