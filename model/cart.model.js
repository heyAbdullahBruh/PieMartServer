const mongoose =require('mongoose');

const cartSchema= new mongoose.Schema({
     customer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
     product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
     quantity:{type:Number,default:1}
});

const Cart = mongoose.model('carts',cartSchema);


module.exports= Cart;