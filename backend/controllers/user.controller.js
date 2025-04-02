const userModel = require('../model/user.model');
const {validationResult} = require('express-validator');
const userService = require('../service/user.service');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {fullname, email, password} = req.body;

    const isAlready = await userModel.findOne({email});

    if(isAlready){
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstName: fullname.firstName,
        lastName: fullname.lastName,
        email,
        password: hashedPassword,
    });

    console.log("user created!!", user);

    const token = user.generateAuthToken();

    res.status(201).json({message: "User created", user, token});
}


module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).josn(errors.array());
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(404).json({message: "User not found"});
    }

    
    const isMatch = await user.comparePassword(password);

    const token = user.generateAuthToken();

    res.cookie("token", token)

    if(!isMatch){
        return res.status(401).json({message: "Unauthorized"});
    } else{
        return res.status(200).json({message: "Logged in successfully", token, user})
    }
}

// module.exports.userProfile = async (req, res, next) => {
//     res.status(200).json(req.user);
// };