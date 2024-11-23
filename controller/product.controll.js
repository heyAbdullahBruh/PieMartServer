const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const cloudinary  = require("../utilities/imgCloud");



const createProduct=async(req, res)=>{
    try {
        const {pName, pDesc, brand, catagory, price, stock}=req.body;
        if (pName && pDesc && brand && catagory && price && stock ) {
            const adminId =req.userId;
            const images=req.files;
            console.log(images);
        // const imgUrls =[];
            const imgUrls = await Promise.all(
                images.map(async (image) => {
                  const result = await cloudinary.uploader.upload(image.path, {
                    resource_type: "auto",
                  });
                  return {
                    photo: result.secure_url,
                    imgId: result.public_id,
                  };
                })
              );
            const newProduct =new Product({
                pName, 
                pDesc, 
                brand:brand.toLowerCase(), 
                catagory:catagory.toLowerCase(), 
                price:parseFloat(price), 
                stock:parseFloat(stock), 
                adminId, 
                pImgs:imgUrls
            });

            await newProduct.save();
            return res.status(201).json({success:true, message:'New product has been created', id:newProduct._id});
        } else {
            return res.status(400).json({success:false, message:'Please fill the form'});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    }
};

const createRating=async (req,  res) => {
    try {
      const { pId } = req.params;
      const { rating } = req.body;
      const userId = req.userId; // assuming req.userId is set after authentication
  
      // Find the product by ID
      const product = await Product.findOne({_id:pId});
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      // Check if the user has already rated this product
      const existingRating = product.rating.find((r) => r.ratUser.toString() === userId.toString());
  
      if (existingRating) {
        // Update existing rating
        existingRating.rat = parseInt(rating);
      } else {
        // Add new rating
        product.rating.push({ ratUser: userId,  rat:parseInt(rating)});
      }
  
      // Calculate the new average rating
      product.averageRat = product.rating.reduce((acc,  curr) => acc + curr.rat,  0) / product.rating.length;
  
      await product.save();
      return res.status(201).json({ success:true, message: 'Rating added/updated successfully' });
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
    }
}


const updateProduct=async(req, res)=>{
    try {
        const {pId}=req.params;
        const {pName, pDesc, brand, catagory, price, stock}=req.body;
        const images=req.files;
        const product=await Product.findOne({_id:pId});
        if(product){
            const imgUrls = await Promise.all(
                images.map(async (image) => {
                  const result = await cloudinary.uploader.upload(image.path, {
                    resource_type: "auto",
                  });
                  return {
                    photo: result.secure_url,
                    imgId: result.public_id,
                  };
                })
              );
            const productUpdate = await Product.findOneAndUpdate({_id:pId}, {$set:{
                pName, 
                pDesc, 
                brand, 
                catagory, 
                price:parseFloat(price), 
                stock:parseFloat(stock), 
                pImgs:imgUrls.length > 0 ? imgUrls : product.pImgs
            }}, {new:true});

            if (productUpdate) {
                return res.status(200).json({success:true, message:'Product has been Updated', id:productUpdate._id});
            } else {
                return res.status(400).json({success:false, message:'Product Update falied'});
            }

        } else {
            return res.status(404).json({success:false, message:'Product Not found'});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    }
};

const getAllItemProduct= async(req, res)=>{
    try {
        const {lowP,highP,lowR,highR}=req.params;
        let { brand } = req.query;  // Use query parameters for dynamic brand filters

        // Check if brand is an array or a single string
        brand = Array.isArray(brand) ? brand : brand ? [brand] : [];

        const products = await Product.find({
            $or: [
               {
                $and:[
                       {
                        $and:[{ averageRat: { $lte: highR}}, {averageRat:{$gte: lowR } }]
                       },
                       {
                        $and:[{ price: { $lte: highP}}, {price:{$gte: lowP } }]
                       }
                ]
               },
                brand.length > 0 ? { brand: { $in: brand } } : {},  // Use $in to filter by multiple brands
            ].filter(Boolean), // Remove empty objects if brand is not specified
        });
            
        if (products.length > 0) {
            return res.status(200).json({success:true, products:products});
        } else {
            return res.status(404).json({success:false, message:'Products not found'});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    };
};

const getAllProduct=async(req, res)=>{
    try {
        const products=await Product.find();
        if (products.length > 0) {
            return res.status(200).json({success:true, products:products.reverse()});
        } else {
            return res.status(404).json({success:false, message:'Products not found'});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    };
};

const getSingleProduct=async(req, res)=>{
    try {
        const {pId}=req.params;
        const product=await Product.findOne({_id:pId});
        if (product) {
            return res.status(200).json({success:true, product});
        } else {
            return res.status(404).json({success:false, message:`Product not found`});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    };
};

const getAdminProduct=async(req, res)=>{
    try {
        const {adminId}=req.params;
        const products=await Product.find({adminId:adminId});
        if (products.length>0) {
            return res.status(200).json({success:true, products});
        } else {
            return res.status(404).json({success:false, message:`Product not found`});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    };
};

const getCataProduct=async(req, res)=>{
    try {
        const {catagory}=req.params;
        const cataProduct=await Product.find({catagory:catagory.toLowerCase()});
        if (cataProduct.length > 0) {
            return res.status(200).json({success:true, products:cataProduct.reverse()});
        } else {
            return res.status(404).json({success:false, message:`Haven't any products in ${catagory} catagory`});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    };
};


const getBrandProduct=async(req, res)=>{
    try {
        const {brand}=req.params;
        const brandProduct=await Product.find({brand:brand.toLowerCase()});
        if (brandProduct.length > 0) {
            return res.status(200).json({success:true, products:brandProduct.reverse()});
        } else {
            return res.status(404).json({success:false, message:`Haven't any products in ${brand} brand`});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
    };
};


const getPriceProduct= async(req, res)=>{
    try {
        const {lowP, highP}=req.params;
        const priceProduct=await Product.find({$and:[{ price: { $gte:lowP } }, { price: { $lte: highP } }]});
        if (priceProduct.length > 0) {
            return res.status(200).json({success:true, products:priceProduct.reverse()});
        } else {
            return res.status(404).json({success:false, message:`Haven't any products in ${lowP} to ${highP} price`});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
    };
};

const getRatProduct= async(req, res)=>{
    try {
        const {lowR, highR}=req.params;
        const ratingProduct=await Product.find({$and:[{ averageRat: { $gte:lowR } }, { averageRat: { $lte: highR }}]});
        if (ratingProduct.length > 0) {
            return res.status(200).json({success:true, products:ratingProduct});
        } else {
            return res.status(404).json({success:false, message:`Haven't any products in ${lowR} to ${highR} price`});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
    };
};



const deleteProduct=async(req, res)=>{
    try {
        const {pId}=req.params;
        const product = await Product.findOne({_id:pId});
        if (product) {
            for(const img of product.pImgs){
                const result = await cloudinary.uploader.destroy(img.imgId);
                if(result.result ==='ok'){
                    const productDelete = await Product.findOneAndDelete({_id:pId});
                    const cartProductDelete =await Cart.deleteMany({product:pId});
                     if(productDelete && cartProductDelete){
                        return res.status(200).json({success:true,message :'Product deleted'});
                     }else{
                        return res.status(400).json({success:false,message :'Product is not deleted'});
                     }
                }else{
                    return res.status(400).json({success:false,message :'photo is not deleted'});
                }
            };
        } else {
            return res.status(404).json({succcess:true, message:'Product not found'});
        }
    } catch (error) {
        return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
    }
};


// const User=async(req, res)=>{
//     try {
        
//     } catch (error) {
//         return res.status(500).json({status:false, message:`Something went worng : ${error.message}`}); 
        
//     }
//   };

module.exports={createProduct, createRating, updateProduct,getAllItemProduct, getAllProduct, getAdminProduct,  getSingleProduct, getPriceProduct, getCataProduct,  getBrandProduct, getRatProduct, deleteProduct};