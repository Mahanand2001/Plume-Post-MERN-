
const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const {v4:uuid} = require('uuid')
const HttpError = require('../models/errorModel')


//CREATE A POST
// POST : api/posts

// PROTECTED
const createPost = async (req, res, next) =>{
    try {
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files){
            return next(new HttpError("Fill in all details and choose thumbnail.", 422))
        }
        const {thumbnail} = req.files;
        //check thre file size
        if(thumbnail.size > 2000000){
            return next(new HttpError("Please choose a thumbnail of size less than 2MB"))
        }
        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFileName = splittedFilename[0]+ uuid() + '.'+ splittedFilename[splittedFilename.length -1]
        thumbnail.mv(path.join(__dirname, '..' , '/uploads', newFileName), async (err) => {
            if(err){
                return next(new HttpError(err))
            }
            else{
                const newPost = await Post.create({title, category, description, thumbnail: newFileName, creator: req.user.id})
                if(!newPost){
                    return next(new HttpError("Post couldn't be created.", 422))
                }
                //find user and increase post count by 1 
                const currentUser = await User.findById(req.user.id)
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})


                res.status(201).json(newPost)
            }
        })

    } catch (error) {
        return next(new HttpError(error))
    }
}

















//GET ALL POST
// GET : api/posts
// PROTECTED
const getPosts = async (req, res, next) =>{
    try {
    const posts = await Post.find().sort({updatedAt:-1})
    if(!posts){
        return next(new HttpError("No posts found.", 404))
    }
    res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}





















//GET A SINGLE POST
// GET : api/posts/:id
// PROTECTED
const getPost = async (req, res, next) =>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if(!post){
            return next(new HttpError("Post not found.", 404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

















//GET A POST BY CATEGORY
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) =>{
    try {
        const {category} = req.params;
        const postByCat = await Post.find({category}).sort({createdAt: -1})
        if(!postByCat){
            return next(new HttpError("No post found for the mentioned category.", 404))
        }
        res.status(200).json(postByCat)
    } catch (error) {
        return next(new HttpError(error))
    }
}






















//GET AUTHOR POST
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) =>{
    try {
        const {id} = req.params;
        const authorPosts = await Post.find({creator: id}).sort({createdAt : -1})
        let user = await User.findById(id).select('name')
        if(authorPosts.length === 0){
            return next(new HttpError("No post to show from author "+ user.name, 422))
        }
        res.status(200).json(authorPosts)
        // res.status(200).json(user.name)
    } catch (error) {
        return next(new HttpError(error))
    }
}


















//EDIT POST
// Patch : api/posts/:id
// PROTECTED
const editPost = async (req, res, next) =>{
    try {
        let fileName;
        let newFilename;
        let updatedPost;

        const postId = req.params.id;
        const {title, category, description } = req.body;
         if(!title || !category || description.length < 12 ){
            return next(new HttpError("Fill in all details and choose thumbnail.", 422))
        }
        const oldPost = await Post.findById(postId);
        if(req.user.id == oldPost.creator){
            if(!req.files){
                 updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new: true})
            }else{
                //get old post from database
                const oldPost = await Post.findById(postId);

                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err)=> {
                    if(err){
                     return next(new HttpError(err))
                 }
                })
                //upload new thumbnail
                 const {thumbnail} = req.files;
                 //check file size
                if(thumbnail.size > 2000000){
                  return next( new HttpError("Thumbnail too big should be less than 2MB"))
                }
                 fileName = thumbnail.name;
                 let splittedFilename = fileName.split('.')
                 newFilename = splittedFilename[0] + uuid() +'.' +splittedFilename[splittedFilename.length - 1]
                 thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err)=> {
                      if(err){return next( new HttpError(err))}
                })
                updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFilename}, {new: true})
            }
        }
        
        if(!updatedPost){
            return next(new HttpError("Couldn't Update Post.", 400))
        }
        res.status(200).json(updatedPost)

    } catch (error) {
        return next(new HttpError(error))
    }
}
















//DELETE POST
// DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) =>{
    try {
        const postId = req.params.id;
        if(!postId){
             return next(new HttpError("Post unavailable.", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;

        if(req.user.id == post.creator){
        // delete thumbnail form uplods folder
        fs.unlink(path.join(__dirname, '..' , 'uploads', fileName), async (err) =>{
            if(err){
                return next(new HttpError(err))
            }
            else {
                await Post.findByIdAndDelete(postId);
                //find user and delete post count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser?.posts - 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});
                res.json(`Post ${postId} deleted successfully.`)
            }
        })
        }
        else{
            return next(new HttpError("Post couldn't be deleted.", 403))
        }
        

    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost}