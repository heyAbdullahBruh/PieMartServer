const mongoose =require('mongoose');

// product item schema
const itemSchema= new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
},{ _id: false });
  

// order  schema
const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
  items: [itemSchema], // Array of items in the order
  totalAmount: {
     type: Number,
     required: true 
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
    required: true 
  }, // e.g., 'credit_card', 'paypal'
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
},{ timestamps: true });

const Order = mongoose.model('orders',orderSchema);


module.exports=Order;

