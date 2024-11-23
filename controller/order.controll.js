// controllers/orderController.js

const Order = require("../model/order.model");
const Product = require("../model/product.model");

// Create a new order
// const createOrder = async (req, res) => {
//   try {
//     const { items, shippingAddress,COD ,totalAmount} = req.body;
//     const userId = req.userId;

//     const alreadyOrderesUser= await Order.findOne({user:userId});
    
//     const orderItems = await Promise.all(
//       items.map(async (item) => {
//         const product = await Product.findById(item.productId);
//         if (!product) return res.status(404).json({success:false,message:`Product not found`});
//         return item;
//         // console.log(item);
//       })
//     );
//     if (alreadyOrderesUser) {
//       alreadyOrderesUser.items.push(items);
//       alreadyOrderesUser.shippingAddress.replace(shippingAddress);
//       alreadyOrderesUser.cashOnDelivery=COD;
//       alreadyOrderesUser.totalAmount+=totalAmount;
//       alreadyOrderesUser.deliveryStatus='pending';
//       await alreadyOrderesUser.save();
//       return res.status(201).json({success:true, message: 'Order placed successfully', order:alreadyOrderesUser });
//     } else {
      
//       // console.log(items);
  
//       // Create the order
//       const newOrder = new Order({
//         user: userId,
//         items:orderItems,
//         totalAmount,
//         shippingAddress,
//         cashOnDelivery:COD,
//       });
  
//       await newOrder.save();
//       return res.status(201).json({success:true, message: 'Order placed successfully', order: newOrder });
//     }
    
//   } catch (error) {
//     return res.status(500).json({success:false, message: error.message });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const { items, customerPhone, shippingAddress, COD } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    // Array to store saved orders
    const savedOrders = [];

    for (const item of items) {
      // Check if the product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      // Create the order
      const order = new Order({
        customerId: userId,
        customerPhone,
        adminId: item.adminId,
        productId: item.productId,
        pName: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice, 
        productImg: item.imageUrl,
        shippingAddress,
        cashOnDelivery: COD,
      });

      // Save the order to the database
      const savedOrder = await order.save();
      savedOrders.push(savedOrder);
    }

    // Respond with all saved orders
    return res.status(201).json({
      success: true,
      message: 'Orders placed successfully',
      // orders: savedOrders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders for a user
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.userId });
    return res.status(201).json({success:true,order:orders });
  } catch (error) {
    return res.status(500).json({success:false, message: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { oId } = req.params;
    const { paymentStatus, deliveryStatus } = req.body;

    const order = await Order.findById(oId);
    if (!order) return res.status(404).json({success:false, message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus || order.paymentStatus;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus || order.deliveryStatus;

    await order.save();
    return res.json({success:true, message: 'Order status updated', order });
  } catch (error) {
    return res.status(500).json({success:false, message: error.message });
  }
};

const getAdminOrderProduct = async (req, res) => {
  try {
    // const { adminId } = req.params;
    const admin = req.userId;
    const orders = await Order.find({adminId:admin});

    if (orders.length>0) {
      return res.json({ success:true, orders });
    } else {
      return res.json({success:false, message: "Haven't any orders" });
      
    }
  } catch (error) {
    return res.status(500).json({ success:false,message: error.message });
  }
};

const orderCencel =async(req,res) => {
  try {
    const { oId } = req.params;

    const order = await Order.findById(oId);
    if (!order) return res.status(404).json({success:false, message: 'Order not found' });

    const cencleOrder = await Order.findOneAndDelete({_id:oId});
    if (cencleOrder) return res.json({success:true, message: 'Order cnecled successfully' });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


module.exports={createOrder, getCustomerOrders,updateOrderStatus, getAdminOrderProduct,orderCencel}