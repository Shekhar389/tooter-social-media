const path=require('path')
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const multer=require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes=require('./routes/auth');
const cors=require('cors')

const app = express();
app.use(cors())
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

app.use('/feed',feedRoutes);
app.use('/auth',authRoutes);
app.use((error,req,res,next)=>{
    console.log(error);
    const message=error.message;
    const status=error.statusCode;
    res.status(status).json({message:message,test:'THIS IS SEND BY SERVER'});
})
mongoose
  .connect(
    ''
  )
  .then(result => {
    
    const SERVER=app.listen(8080);
    //Socket Code Here
    const io = require('./socket').init(SERVER);
    io.on('connection',socket=>{
      console.log("Client Socket Connected");
    })
  })
  .catch(err => console.log(err));