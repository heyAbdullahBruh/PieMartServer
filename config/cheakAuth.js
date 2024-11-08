const JWT = require('jsonwebtoken');

const cheakAuth = (req,res,next)=>{
    try {
        const token=req.headers.authorization;
        // console.log(token);
        JWT.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
            if(err) return res.status(400).json({message:'Authentication error'});
            const {userId,userRole}=decoded;
            req.userId=userId;
            req.isAdmin=userRole;
            next();
        });
    } catch (error) {
        next(error.message);
    };
};


module.exports=cheakAuth;