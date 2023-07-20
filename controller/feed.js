const { validationResult } = require('express-validator');
const Post = require('../models/post');
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