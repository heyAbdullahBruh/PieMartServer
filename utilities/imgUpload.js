const multer = require('multer');
const path = require('path');

// User profile pics uploader
const Ustorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/userImg');
    },
    filename:(req,file,cb)=>{

        const fileExt=path.extname(file.originalname);
        const filename=file.originalname.replace(fileExt,"").toLowerCase() + Date.now() ;
        cb(null,filename+fileExt);  
        // console.log(file);  
    }
  });
  
  const uploadProfle=multer({
    storage:Ustorage,
    limits:{
        fileSize:100000000
    }
  });


// Product pics uploader
  const productStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/productImg');
    },
    filename:(req,file,cb)=>{

        const fileExt=path.extname(file.originalname);
        const filename=file.originalname.replace(fileExt,"").toLowerCase() + Date.now() ;
        cb(null,filename+fileExt);  
        // console.log(file);  
    }
  });
  
  const uploadPImg=multer({
    storage:productStorage
  });






module.exports ={uploadProfle,uploadPImg};