const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "first name must be atleast 3 characters"],
    },
    lastName: {
      type: String,
      minlength: [3, "last name must be atleast 3 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "last name must be atleast 3 characters"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, "password must be atleast 6 characters"],
  },
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "24h"});
    return token;
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Hash password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
