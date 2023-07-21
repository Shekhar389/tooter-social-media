const { validationResult } = require('express-validator');
const Post = require('../models/post');
const path=require('path');
const fs=require('fs');
exports.getPosts = (req, res, next) => {                          //Fetching All post
    Post.find()
    .then(post=>{
        res.status(200).json({message:'Successfully Fetched Posts ', posts: post});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
  };
  exports.createPost = (req, res, next) => {                                        //Creating A Post
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error=new Error("Validation failed, entered data is incorrect.");
        error.statusCode=422;
        throw error;
    }
    if(!req.file){
        const error=new Error("No Image Provided");
        error.statusCode=422;
        throw error
    }
    const imageUrl = req.file.path.replace("\\" ,"/");
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: { name: 'Maximilian' }
    });
    post
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Post created successfully!',
          post: result
        });
      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
      });
  };

  exports.getPost=(req,res,next)=>{                             //Fetching Single Post
    const postId=req.params.postId;
    Post.findById(postId)
    .then(post=>{
        if(!post){
            const error=new Error("Post Not Found");
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({message : 'post fetched ', post:post})

    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
  }

  exports.updatePost=(req,res,next)=>{
    const postId=req.params.postId;
    console.log("This is ID  " +postId)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error=new Error("Validation failed, entered data is incorrect.");
        error.statusCode=422;
        throw error;
    }
    const title=req.body.title;
    const content=req.body.content;
    let imageUrl=req.body.image;
    if(req.file){
      imageUrl=req.file.path.replace("\\" ,"/");
      console.log("This is Image URL 1 "+imageUrl)
    }
    if(!imageUrl){
      const error=new Error("No File Picked");
      error.statusCode=422;
      throw error;
    }
    console.log("This is Image URL "+imageUrl)
    Post.findById(postId)
    .then(post=>{
      if(!post){
        const error=new Error("Post Not Found");
        error.statusCode=404;
        throw error;
      }
      if(imageUrl!==post.imageUrl){
        clearImage(post.imageUrl);
      }
      post.title=title;
      post.imageUrl=imageUrl;
      post.content=content;
      return post.save();
    })
    .then(result=>{
      res.status(200).json({message : 'Post Updated',post:result})
    })
    .catch(err=>{
      if(!err.statusCode){
        err.statusCode=500;
      }
      next(err);
    })
  };

 exports.deletePost= async (req,res,next)=>{
  console.log("I am In this controller")
  const postId=req.params.postId;
  console.log(`deleting ${postId}`);
  try{
    const post=await Post.findById(postId);
    if(!post){
      const error=new Error("Post Not Found");
      error.statusCode=404;
      throw error;
    }
    clearImage(post.imageUrl);
    await post.deleteOne();
    res.status(200).json({message :'Post Deleted'})
  }
  catch(error){
    next(error);
  }

};

  const clearImage= filePath =>{
    filePath=path.join(__dirname,'..',filePath);
    fs.unlink(filePath,(err)=>{console.log(err)})

  }