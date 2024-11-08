const cheakAuth = require('../config/cheakAuth');
const { registerUser, getUser, updateUser, updatePass, deleteUser, getAllUser, updateAdmin } = require('../controller/user.controll');
const { uploadProfle } = require('../utilities/imgUpload');

const router =require('express').Router();



router.post('/user/register',uploadProfle.single('profile'),registerUser);
router.get('/user/:uId',cheakAuth,getUser);
router.patch('/user/update/:uId',cheakAuth,uploadProfle.single('profile'),updateUser);
router.patch('/user/uP/:uId',cheakAuth,updatePass);
router.patch('/user/switchAdmin/:uId',cheakAuth,updateAdmin);
router.delete('/user/delete/:uId',cheakAuth,deleteUser);


router.get('/users',getAllUser);




module.exports=router;