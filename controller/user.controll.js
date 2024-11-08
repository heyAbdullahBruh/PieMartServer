const USER = require("../model/user.model");
const bcrypt=require('bcrypt');
const cloudinary  = require("../utilities/imgCloud");
const saltRound =10;

// Register User
const registerUser=async(req,res)=>{
  try {
      const {name,mail,password}=req.body;
      if (name && mail && password) {

        const email = await USER.findOne({mail:mail});
        if (email) return res.status(400).json({success:false,message:'Email already exist'});

        const hashedPass=await bcrypt.hash(password,saltRound);
        let profileImg='';
        if (req.file) {
            const result =  await cloudinary.uploader.upload(req.file.path,{
                resource_type:"auto"
            });
            profileImg=result.secure_url;
        }
        

        const newUser = new USER({
            name:name,
            mail:mail,
            password:hashedPass,
            profile:profileImg?profileImg:'https://i.postimg.cc/T3kNzYSD/user.jpg'
        });

        await newUser.save();
        if(newUser) return res.status(201).json({success:true,message:'Registration successfully',newUser});
        else return res.status(400).json({success:false,message:'Registration failed'});
      } else {
        return res.status(404).json({success:false,message:'Please fill the form '});
      };

  } catch (error) {
      return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
      
  };
};

// Update User
const updateUser= async (req,res)=>{
    try {
        const {name,mail}=req.body;
        const {uId}=req.params;
  
          const user = await USER.findOne({_id:uId});
          if (user) { 
  
            let profileImg='';
            if (req.file) {
                const result =  await cloudinary.uploader.upload(req.file.path,{
                    resource_type:"auto"
                });
                profileImg=result.secure_url;
            }
            
            const userUpdate = await USER.findOneAndUpdate({_id:uId},{$set:{
                name:name,
                mail:mail,
                profile:profileImg?profileImg:user.profile
            }},{new:true});
    
            if(userUpdate) return res.status(201).json({success:true,message:'Update successfully',userUpdate});
            else return res.status(400).json({success:false,message:'Update failed'});
        }else{
            return res.status(404).json({success:false,message:'User Not found'});
        }
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    };
};

// Update User Password
const updatePass=async (req,res)=>{
    try {
        const {oldPass,newPass}=req.body;
        const {uId}=req.params;
  
          const user = await USER.findOne({_id:uId});
          if (user) { 
            const result = await bcrypt.compare(oldPass, user.password);
            if(result){
                const hashedPass=await bcrypt.hash(newPass,saltRound);

                const passUpdate = await USER.findOneAndUpdate({_id:uId},{$set:{
                    password:hashedPass
                 }},{new:true});
        
                if(passUpdate) return res.status(201).json({success:true,message:'Password Update successfully'});
            }else return res.status(400).json({success:false,message:'Password Incorrect'});
        }else{
            return res.status(404).json({success:false,message:'User Not found'});
        };
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    };
};

// Update User Password
const updateAdmin=async (req,res)=>{
    try {
        const {password}=req.body;
        const {uId}=req.params;
  
          const user = await USER.findOne({_id:uId});
          if (user) { 
            const result = await bcrypt.compare(password, user.password);
            if(result){
                const userUptoAdmin = await USER.findOneAndUpdate({_id:uId},{$set:{
                    isAdmin:true
                 }},{new:true});
        
                if(userUptoAdmin) return res.status(201).json({success:true,message:'Congress,You switch to vendor'});
            }else return res.status(400).json({success:false,message:'Password Incorrect'});
        }else{
            return res.status(404).json({success:false,message:'User Not found'});
        };
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    };
};

// get user 
const getUser=async(req,res)=>{
    try {
        const {uId}=req.params;
        const user = await USER.findOne({_id:uId});
        if(user){
            return res.status(200).json({success:true,user});
        }else{
            return res.status(404).json({success:true,message:'user not found'});
        };
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    };
};

// get user 
const getAllUser=async(req,res)=>{
    try {
        const user = await USER.find();
        if(user){
            return res.status(200).json({success:true,user});
        }else{
            return res.status(404).json({success:true,message:'user not found'});
        };
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    };
};

// user delete 
const deleteUser=async(req,res)=>{
    try {
        const {uId}=req.params;
        const {password}=req.body
        const user = await USER.findOne({_id:uId});
        if(user){
            const result = await bcrypt.compare(password, user.password);
            if(result){
                const userDelete=await USER.findOneAndDelete({_id:uId});
                if(userDelete) return res.status(200).json({success:true,user});
                else return res.status(400).json({success:false,message:`user hasn't delete`});
            }else return res.status(400).json({success:false,message:'Password Incorrect'});
        }else{
            return res.status(404).json({success:true,message:'user not found'});
        };
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
        
    };
};




module.exports={registerUser,updateUser,updatePass,updateAdmin,getUser,getAllUser,deleteUser};