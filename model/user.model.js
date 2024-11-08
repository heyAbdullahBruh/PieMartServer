const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:[true,'Name is require'],
    },
    mail:{
        type:String,
        required:[true,'mail is require'],
        validate:{
            validator:(v)=>{
                return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(v)
            },
            message:(prp)=>`${prp.value} is not a valid mail`
        },
        unique:[true,'Mail must have been unique']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    profile:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    googleUser:{
        type:Boolean,
        default:false
    },
    cart: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity:{type:Number,default:1}
        },
      ]
},{timestamps:true});

const USER = mongoose.model('users',userSchema);


module.exports= USER;
