const mongoose = require('mongoose');

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
    rating:[ 
        {
            rat:{type:Number},
            ratUser:{type:mongoose.Schema.Types.ObjectId},
        },
    ],
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