// controllers/orderController.js

const Order = require("../model/order.model");
const Product = require("../model/product.model");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({success:false,message:`Product ${item.product} not found`});
        totalAmount += product.price * item.quantity;
        return {
          product: item.product,
          quantity: item.quantity,
          price: product.price,
          admin:product.adminId
        };
      })
    );

    // Create the order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();
    return res.status(201).json({success:true, message: 'Order created successfully', order: newOrder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get orders for a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    return res.status(201).json({success:true,order:orders.reverse() });
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
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    await order.save();
    return res.json({ message: 'Order status updated', order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAdminOrderProduct = async (req, res) => {
  try {
    // const { adminId } = req.params;
    const admin = req.admin;
    const orders = await Order.find({[items.admin]:admin});

    // const order = await Order.find({adminId});
    if (orders.length>0) {
      return res.json({ success:true, orders });
    } else {
      return res.json({success:false, message: "Haven't any orders" });
      
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




module.exports={createOrder, getUserOrders,updateOrderStatus, getAdminOrderProduct}