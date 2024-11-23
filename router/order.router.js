const cheakAuth = require('../config/cheakAuth');
const isAdmin = require('../config/isAdmin');
const { createOrder, getCustomerOrders, updateOrderStatus, getAdminOrderProduct, orderCencel } = require('../controller/order.controll');

const router =require('express').Router();

// for athentic user
router.post('/order/create',cheakAuth,createOrder);
router.get('/order/userorder',cheakAuth,getCustomerOrders);
router.delete('/order/cencle/:oId',cheakAuth,orderCencel);

// for athentic admin 
router.patch('/order/update/:oId',cheakAuth,isAdmin,updateOrderStatus);
router.get('/order/adminOrderProduct',cheakAuth,isAdmin,getAdminOrderProduct);


module.exports=router;