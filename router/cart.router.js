const cheakAuth = require('../config/cheakAuth');
const { addToCart, removeFromCart, productQuantity, userCart } = require('../controller/cart.controll');

const router = require('express').Router();


router.post('/cart/add',cheakAuth,addToCart);
router.get('/cart/usercart',cheakAuth,userCart);
router.patch('/cart/quantity/:pId',cheakAuth,productQuantity);
router.delete('/cart/remove',cheakAuth,removeFromCart);




module.exports=router;