const multer = require('multer');
const path = require('path');
const fs = require("fs");
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

  const productImgPath = path.join(__dirname, "./public/productImg");
  
  if (!fs.existsSync(productImgPath)) {
    fs.mkdirSync(productImgPath, { recursive: true });
  }
  
  // Define storage
  const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, productImgPath);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname); // Extract file extension
      const filename =
        file.originalname.replace(fileExt, "").toLowerCase().replace(/[^a-z0-9]/g, "_") + 
        "_" + 
        Date.now(); // Replace special characters and add timestamp
      cb(null, filename + fileExt);
    },
  });
  
  const uploadPImg=multer({
    storage:productStorage
  });






module.exports ={uploadProfle,uploadPImg};