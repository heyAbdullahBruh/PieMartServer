const { logInUser, googleLogIn } = require('../controller/auth.controll');

const router = require('express').Router();


router.post('/auth/logIn',logInUser);
router.post('/auth/googleLogin',googleLogIn);


module.exports=router;