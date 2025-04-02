const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require("../middlewares/auth.middleware")

router.post(
    "/signup",
    [
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("fullname.firstName").isLength({min: 3}).withMessage("First name must be atleast 3 characters"),
        body('password').isLength({min: 6}).withMessage("Password must be atleast 6 characters")
    ], 
    userController.registerUser
)

router.post("/login", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min: 6}).withMessage("Password must be atleast 6 characters")
], userController.loginUser
)

// router.get("/profile",authMiddleware.authuser, userController.userProfile)

module.exports = router;
