const express= require('express');
const cors= require('cors');

const app =express();

const userRouter = require('./router/user.router');
const authRouter = require('./router/auth.router');
const productRouter = require('./router/product.router');
const cartRouter = require('./router/cart.router');
const orderRouter = require('./router/order.router');


// middleware duction calling---->
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));



// home route
app.get('/',(req,res)=>{
    try {
        return res.status(200).sendFile(__dirname+'/view/index.html');
    } catch (error) {
        return res.status(500).json({status:false,message:`Something went worng : ${error.message}`}); 
    }
});

// user router
app.use('/api',userRouter)

// auth router
app.use('/api',authRouter)

// product router
app.use('/api',productRouter)

// cart router
app.use('/api',cartRouter)

// Order router
app.use('/api',orderRouter)



// false route's error definder
app.use((req,res,next)=>{
    return res.status(404).json({status:false,message:'the route is not found'});
});


// server error definder
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success:false,
      message: error.message || 'Internal Server Error'
    });
});








module.exports =app;