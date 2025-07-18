
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";


export const test = (req,res) => {
    res.send('Hello Wordl');
 } 

 export const updateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only update your own account!'))
    
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
              $set:{ // changes only those values which are filled in profile form as some values may be left empty
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar,
              }
            },{new : true})//this line updates the database w/ new information
        const {password, ...rest} = updatedUser._doc;   
        res.status(200).json(rest); 
    }
    catch(error){
        next(error)
    }
 };

 export const deleteUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only delete your own account!'));
    try{
       await User.findByIdAndDelete(req.params.id);
        //<Link to = '/sign-up'/>
        res.clearCookie('access_token'); 
        res.status(200).json("User has been deleted!");
    }
    catch(error){
        next(error)
    }
 };

 export const getUserListings = async (req, res, next) => {
   if(req.user.id === req.params.id){
    try{
      const listings = await Listing.find({userRef : req.params.id}); 
      res.status(200).json(listings);  
    }
    catch(error){
      next(error);
    }
   }
   else{
    return next(errorHandler(401,req.user.id));
   }
 }