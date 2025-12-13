const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: {type:String}
});

const userModel= mongoose.model("Userdata",UserSchema)
module.exports=userModel;