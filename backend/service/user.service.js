const userModel = require("../model/user.model");

module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = userModel.create({
    fullname: {
      firstName,
      lastName,
    },
    email,
    password,
  });
  console.log("user created", user);
  return user;
};
