const cheakAuth = require('../config/cheakAuth');
const { addToCart, removeFromCart, productQuantity, getCartProduct } = require('../controller/cart.controll');

const router = require('express').Router();


router.post('/cart/add',cheakAuth,addToCart);
// router.get('/cart/usercart',cheakAuth,userCart);
router.get('/cart/cartproduct',cheakAuth,getCartProduct);
router.patch('/cart/quantity/:cId/:pId',cheakAuth,productQuantity);
router.delete('/cart/remove/:cId',cheakAuth,removeFromCart);




module.exports=router;