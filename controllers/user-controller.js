import User from "../model/User.js";
import bcrypt from 'bcryptjs' 

export const getAllusers = async(req , res , next) => {
    let users; 
    try {
        users = await User.find(); 
    }catch(err) {
      return  console.log(err);
    }
    if (!users) {//there are no users 
        return res.status(404).json({msg : "No users found" }); 
    }
    return res.status(200).json({users}); 
}

export const signup = async(req , res, next) => {
    const {name , email , password} = req.body; 

    let existingUser; 
    try {
        existingUser = await User.findOne({email}); 
    }catch(err) {
       return console.log(err);
    }
    if(existingUser) {
        return res.status(400).json({msg: "User Already Exists! Login Instead"})
    }

    
    const hashedPassword = bcrypt.hashSync(password); 

    const user = new User({
        name, 
        email, 
        password: hashedPassword, 
        blogs:[]
    }); 


    try{
       await user.save(); 
    }catch(err) {
        return console.log(err);
    }
    return res.status(201).json({user}); 
}

export const login = async (req , res , next) => {
    const {name , email , password} = req.body; 
    let existingUser; 
    try{
        existingUser = await User.findOne({email}); 

    }catch(err) {
        console.log(err);
    }
    if (!existingUser) {
        return res.status(404).json({msg: "Could Not Find User By This Email"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password , existingUser.password); 

    if (!isPasswordCorrect) {
        return res.status(404).json({msg: "Incorrect Password"}); 
    }
    return res.status(200).json({msg: "Login Succefull"})

}