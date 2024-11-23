const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const USER = require("../model/user.model");

const addToCart = async(req,res)=>{
  try {
    const { productId } = req.body;
    const product = await Product.findOne({_id:productId});
  
    if(!product){
       return res.status(404).json({success:false,message:'Product is not found '});
    }else{
        const productInCart =await Cart.findOne({product:productId});
    
        if (productInCart) {
          return res.status(400).json({success:false,message:'The product already add in your cart'});
        } else {
          const newCart = new Cart({
            product:productId,
            customer:req.userId
          });
          await newCart.save();
          return res.status(201).json({success:true,message:'Add your cart'});
        };
    }
  } catch (error) {
      return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};

const productQuantity = async(req,res)=>{
  try {
    const { quantity } = req.body;
    const { cId,pId } = req.params;
    // const user = await USER.findOne({_id:req.userId});
    const cartUpdate =await Cart.findOneAndUpdate({$and:[{ _id: cId },{ product: pId}]},{$set:{
      quantity:quantity,
    }},{new:true});

    if (cartUpdate) {
      const userCart = await Cart.find({customer:req.userId}).populate('product', 'pName price adminId pImgs');
      if (!userCart || userCart.length === 0) {
          return res.status(200).json({success:false, message: 'Cart is empty'});
      }
      // Format the response
      const cartWithDetails = userCart.map(item => ({
          _id:item.id,
          productId: item.product._id,
          adminId: item.product.adminId,
          name: item.product.pName,
          price: item.product.price,
          imageUrl: item.product.pImgs,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity
      }));
  
      return res.status(200).json({success:true,cart:cartWithDetails});
    }
  
  } catch (error) {
      return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};

const getCartProduct=async(req,res)=>{
  try {

    // Find user and populate cart product details
    const userCart = await Cart.find({customer:req.userId}).populate('product', 'pName price adminId pImgs');

    if (!userCart || userCart.length === 0) {
        return res.status(200).json({ success:false,message: 'Cart is empty', });
    }
      // Format the response
      const cartWithDetails = userCart?.map(item => ({
        _id:item?._id,
        productId: item?.product?._id,
        adminId: item?.product?.adminId,
        name: item?.product?.pName,
        price: item?.product?.price,
        imageUrl: item?.product?.pImgs,
        quantity: item?.quantity,
        totalPrice: item?.product?.price * item?.quantity
    }));
    

    if (cartWithDetails?.length > 0) {
        return res.status(200).json({
          success: true,
          cart: cartWithDetails
      });
    } else {
        return res.status(200).json({
          success: false,
          message:"Haven't any product in your cart . please add some product in your cart "
      });
    }

   
  } catch (error) {
    return res.status(500).json({status:false,message:`Something went worng : ${error.message}`});  
  };
 };


// const userCart = async(req,res)=>{
//   try {
//     const user = await USER.findOne({_id:req.userId});
//     return res.status(200).json({success:true,cart:user.cart.reverse()});
//   } catch (error) {
//       return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
//   };
// };

const removeFromCart = async (req, res) => {
  try {
    const { cId} = req.params;
    const cartDel = await Cart.findOneAndDelete({_id:cId});
    if (cartDel) {
      return res.status(200).json({success:true,message:'Product remove from cart'});
    }

  } catch (error) {
    return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
  };
};


module.exports={addToCart,getCartProduct,removeFromCart,productQuantity};

// const User=async(req,res)=>{
//  try {
        
//  } catch (error) {
//    return res.status(500).json({status:false,message:`Something went worng : ${error.message}`});  
//  };
// };