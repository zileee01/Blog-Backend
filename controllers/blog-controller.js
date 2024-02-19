import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req , res ,next) => {
    let blogs; 
    try{

        blogs = await Blog.find(); 

    }catch(err) {
        return console.log(err);
    }
    if (!blogs) {
      
        return res.status(404).json({msg: "No Blogs Found"}); 

    }
    return res.status(200).json({blogs})
}

export const addBlog = async(req , res , next) => {
    const {title , description , image, user} = req.body; 

    let existingUser; 

    try {
        existingUser = await User.findById(user); 
    } catch (err) {
        console.log(err);
    }
    
    if(!existingUser) {
        return res.status(400).json({msg: "Unable To Find User By This Id"}); 
    }



    const blog = new Blog({
        title, 
        description, 
        image, 
        user
    }); 

    try {
       const session = await mongoose.startSession(); 
       session.startTransaction(); 
       await blog.save({session}); 
       existingUser.blogs.push(blog); 
       await existingUser.save({session});
       await session.commitTransaction();  
    } catch (err) {
        
         console.log(err);
         return res.status(500).json({msg : err}); 
    }

    return res.status(200).json({ blog }); 

}; 

export const updateBlog = async (req , res , next ) => {
    const {title , description} = req.body; 
    const blogId = req.params.id ; 
    let blog; 
    try {
        blog = await Blog.findByIdAndUpdate(blogId , {
            title, 
            description
        })
    } catch (err) {
      return console.log(err);
    }

    if(!blog) {
        return res.status(500).json({msg :"Unable To Update The Blog"})
    }

    return res.status(200).json({blog}); 


}

export const getById = async (req , res , next) => {
    const id = req.params.id; 
    let blog; 
    try {
        blog = await Blog.findById(id); 
        
    } catch (err) {

        return console.log(err);
        
    }
    if (!blog) {
        res.status(404).json({msg : "No Blog Found"}); 
    }

    return res.status(200).json({blog}) ;
}

export const deleteBlog = async(req,  res , next) => {
    const id = req.params.id; 
    let blog; 

    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);  
        await blog.user.save(); 
        
    } catch (err) {
      return  console.log(err); 
    }
    if(!blog) {
        return res.status(500).json({msg:"Unable To Delete"}); 
    }

    return res.status(200).json({msg: "Successfully Deleted"}); 

}

export const getByUserId = async (req , res, next) => {
    const userId = req.params.id; 
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs"); 
    } catch (err) {
        return console.log(err);
    }

    if (!userBlogs) {
        return res.status(404).json({msg : "No Blog Found"}); 

    }

    return res.status(200).json({blogs: userBlogs}); 
}