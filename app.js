const path=require('path')
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const multer=require('multer');
const feedRoutes = require('./routes/feed');

const app = express();
const { v4: uuidv4 } = require('uuid');
 
const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4()+'-'+file.originalname)
    }
});

const fileFilter=(req,file,cb)=>{
          if(file.mimetype==='image/png'||file.mimetype==='image/jpeg'||file.mimetype==='image/jpg'){
            cb(null,true);
          } 
          else{
            cb(null,false);
          }     
}
//app.use(bodyparser.urlencoded({ extended: true }))//used for form
app.use(bodyparser.json());
app.use(multer({storage :fileStorage,fileFilter:fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));//Images folder as static folder
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})
app.use('/feed',feedRoutes);
app.use((error,req,res,next)=>{
    console.log(error);
    const message=error.message;
    const status=error.statusCode;
    res.status(status).json({message:message});
})
mongoose
  .connect(
    
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err)); //Test Commit