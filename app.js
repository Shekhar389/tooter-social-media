const path=require('path')
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();
//app.use(bodyparser.urlencoded({ extended: true }))//used for form
app.use(bodyparser.json());
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
    'mongodb+srv://kshekhar2807:mKMIOJ2RI6Q6gawO@cluster0.gcxkevb.mongodb.net/tooter?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));