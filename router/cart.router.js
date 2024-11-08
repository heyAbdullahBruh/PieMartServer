const cheakAuth = require('../config/cheakAuth');
const { addToCart, removeFromCart, productQuantity } = require('../controller/cart.controll');

const router = require('express').Router();


router.post('/cart/add',cheakAuth,addToCart);
router.post('/cart/quantity',cheakAuth,productQuantity);
router.delete('/cart/remove',cheakAuth,removeFromCart);




module.exports=router;