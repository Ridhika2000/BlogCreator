const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require('jsonwebtoken');


const userSchema = new Schema(
  {
    email: {
      type: String,
      required:true,
      unique:true
    },
    userId:{
      type:String
    },
    bodyOfBlog:[{
        title:String,
        content:String
    }],
    hash:String,
    salt: String,
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function(){
  try{
    console.log(this._id);
    let token = jwt.sign({_id:this._id}, process.env.JWT_KEY, {expiresIn:'120m'})
    console.log(token);
    this.tokens = this.tokens.concat({token:token})
    await this.save();
    return token;
  }
  catch(error){
    res.send("error");
    console.log('error');
  }
}
userSchema.methods.setPassword = function(password) {
     
  
     this.salt = crypto.randomBytes(16).toString('hex');
     this.hash = crypto.pbkdf2Sync(password, this.salt, 
     1000, 64, `sha512`).toString(`hex`);
 };
   
 userSchema.methods.validPassword = function(password) {
     var hash = crypto.pbkdf2Sync(password, 
     this.salt, 1000, 64, `sha512`).toString(`hex`);
     return this.hash === hash;
 };

module.exports = mongoose.model("User", userSchema);
