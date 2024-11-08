const cheakAuth = require('../config/cheakAuth');
const isAdmin = require('../config/isAdmin');
const { createProduct,createRating,updateProduct,getAllProduct,getPriceProduct,getCataProduct, getBrandProduct,getRatProduct,deleteProduct, getSingleProduct, getAdminProduct } = require('../controller/product.controll');
const { uploadPImg } = require('../utilities/imgUpload');

const router = require('express').Router();

// for admin
router.post('/product/create',cheakAuth,isAdmin,uploadPImg.array('pImgs',10),createProduct);
router.patch('/product/update/:pId',cheakAuth,isAdmin,uploadPImg.array('pImgs',10),updateProduct);
router.delete('/product/delete/:pId',cheakAuth,isAdmin,deleteProduct);

// for autenticate user
router.post('/product/rating/:pId',cheakAuth,createRating);

// For all user
router.get('/products',getAllProduct);
router.get('/product/vendor/:adminId',getAdminProduct);
router.get('/product/:pId',getSingleProduct);
router.get('/product/prcRng/:lowP/:highP',getPriceProduct);
router.get('/product/catagory/:catagory',getCataProduct);
router.get('/product/brand/:brand',getBrandProduct);
router.get('/product/rat/:lowR/:highR',getRatProduct);




module.exports=router;