exports.getPosts=(req,res,next)=>{
    res.status(200).json({posts: [{_id:'1' ,title : 'Siddhant Singh',content :'This is first post',imageUrl:'images/1109789.png',creator:{name:'Shekhar'},createdAt:new Date()}]})
}
exports.createPost=(req,res,next)=>{
    const title=req.body.title;
    const content=req.body.content;
    
    res.status(201).json({message:'Post created successfully',
            post : { 
                id: new Date().toISOString() ,
                title:title ,
                content:content,
                creator:{
                    name : 'Shekhar',
                    createdAt:new Date(),
                        }
        }
    })
}