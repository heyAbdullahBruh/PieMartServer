const mongoose =require('mongoose');

// product item schema
// const itemSchema= new mongoose.Schema({
//   type:Array,
// },{ _id: false });
  

// order  schema
const orderSchema = new mongoose.Schema({
  customerId : { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
   },
   customerPhone : { 
    type: String,
    required: true
   },
   adminId : { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
   },
   productId : { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
   },
   pName: {
    type: String, 
    required: true 
  },
  price: {
    type: Number, 
    required: true 
  },
   quantity: {
    type: String, 
    required: true 
  },
  totalPrice: {
    type: Number, 
    required: true 
  },
  productImg: {
    type: Array, 
  },
  shippingAddress: {
    type: String, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    default:'none'
  },// e.g., 'credit_card', 'paypal'
  cashOnDelivery: { 
    type: Boolean, 
    // default:false
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
},{ timestamps: true });

const Order = mongoose.model('orders',orderSchema);


module.exports=Order;

