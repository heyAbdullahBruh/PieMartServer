

const isAdmin =async(req,res,next)=>{
  try {
      if(req.isAdmin === true){
        next();
      }else{
        return res.status(403).json({success:false, message: 'Access forbidden: Admins only' });
      };
  } catch (error) {
    return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};

module.exports=isAdmin;