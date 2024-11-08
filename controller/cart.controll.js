const Product = require("../model/product.model");
const USER = require("../model/user.model");

const addToCart = async(req,res)=>{
  try {
    const { productId } = req.body;
    const user = await USER.findOne({_id:req.userId});
    const product = await Product.findOne({_id:productId});
  
    if(!product){
       return res.status(404).json({success:false,message:'Product is not found '});
    }else{
        const productInCart = user.cart.find((item) => item.product.toString() === productId);
    
      if (productInCart) {
        return res.status(400).json({success:false,message:'The product already add in your cart'});
      } else {
        user.cart.push({ product: productId });
      };
    
      await user.save();
      return res.status(201).json({success:true,message:'Add your cart',cart:user.cart});
    }
    
  } catch (error) {
      return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};

const productQuantity = async(req,res)=>{
  try {
    const { quantity } = req.body;
    const { pId } = req.params;
    const user = await USER.findOne({_id:req.userId});
    const cart = user.cart.find((c)=>c.product.toString()===pId);
    cart.quantity =quantity;
    await user.save();
    return res.status(201).json({success:true,cart});
  } catch (error) {
      return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};

const userCart = async(req,res)=>{
  try {
    const user = await USER.findOne({_id:req.userId});
    return res.status(200).json({success:true,cart:user.cart.reverse()});
  } catch (error) {
      return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await USER.findOne({_id:req.userId});
  
    user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    await user.save();
    return res.status(200).json({success:true,message:'Product remove from cart',cart:user.cart});
  } catch (error) {
    return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};


module.exports={addToCart,userCart,removeFromCart,productQuantity};

// const User=async(req,res)=>{
//  try {
        
//  } catch (error) {
//    return res.status(500).json({status:false,message:`Something went worng : ${error.message}`});  
//  };
//};