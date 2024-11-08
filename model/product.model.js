const mongoose = require('mongoose');

const ratingSchema=new mongoose.Schema( {
   rat:{type:Number},
   ratUser:{type:mongoose.Schema.Types.ObjectId},
},{ _id: false });

const productSchema = new mongoose.Schema({
    pName:{
        type:String,
        required:[true,'Product name is require']
    },
    pDesc:{
        type:String,
        required:[true,'Product desciprtion is require']
    },
    brand:{
        type:String,
        required:[true,'Product brand is require']
    },
    catagory:{
        type:String,
        required:[true,'Product brand is require']
    },
    price:{
        type:Number,
        required:[true,'Product number is require']
    },
    stock:{
        type:Number,
        required:[true,'stock number is require']
    },
    rating:[ratingSchema],
    averageRat:{
        type:Number,
        default:0
    },    
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pImgs:{
        type:Array
    },
},{timestamps:true})


const Product = mongoose.model('products',productSchema);


module.exports=Product;