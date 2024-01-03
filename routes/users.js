const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// connecting the mongoose with the local host 
mongoose.connect("mongodb://127.0.0.1/pinterest");

// creating the schema for the user 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  dp: {
    type: String, // You might want to store the path to the profile picture or use a different data type depending on your needs
    default: "default.jpg", // Set a default image if needed
  },
});

userSchema.plugin(plm);
const User = mongoose.model("User", userSchema);
module.exports = User;
