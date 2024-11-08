require('dotenv').config();
const USER = require("../model/user.model");
const bcrypt=require('bcrypt');
const JWT = require('jsonwebtoken');

const logInUser=async(req,res)=>{
    try {
        const {mail,password}=req.body;
          if ( mail && password) {
              const user  = await USER.findOne({mail:mail});
              if (user) {
                   bcrypt.compare(password,user.password,(err,result)=>{
                        if(result===true){
                            const payload= {
                                userId:user._id,
                                userRole:user.isAdmin
                              };
                              const token =JWT.sign(payload,process.env.JWT_SECRET);

                             return res.status(200).json({
                                success:true,
                                message:'User Logged In Successfully',
                                token:token
                             });
                        }else{
                            return res.status(400).json({success:false,message:'Authentication failed: incorect password'});
                        }
                   });
                  
              } else {
                return res.status(404).json({success:false,message:'Authentication failed: not found'});
              }
          } else {
             return res.status(400).json({success:false,message:`Please fill the form`});   
          }
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    }
  };


const googleLogIn =async(req,res)=>{
    try {
        const {name,mail,profile}=req.body;
        const user=await USER.findOne({mail:mail});
        if(!user){
            const addUser=new USER({
                name:name,
                mail:mail,
                googleUser:true,
                password:' ',
                profile:profile
            });
            const newUser=await addUser.save();
                const payload={
                    userId:newUser._id,
                    userRole:newUser.isAdmin
                };
                const token= JWT.sign(payload, process.env.JWT_SECRET);
        
            return res.status(200).json({
                success:true,
                message:'User Logged In Successfully',
                token:token
            });
        };
        if(user) {
            const googleUser=user.googleUser;
               if(googleUser===true){
                const payload={
                    userId:user._id,
                    userRole:user.isAdmin
                };
                const token= JWT.sign(payload, process.env.JWT_SECRET); 
                return res.status(200).json({
                    success:true,
                    message:'User Logged In Successfully',
                    token:token
                });
               };

               if(googleUser===false){
                return res.status(400).json({message:'Mail Already exist',success:false});
            };
        };

    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
    };
};

module.exports={logInUser,googleLogIn};

// const User=async(req,res)=>{
//     try {
        
//     } catch (error) {
//         return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
//     }
//   };

