const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const app = express();
const bcrypt = require('bcryptjs')
app.set('view engine', 'ejs');
let path = require("path");
const User = require("../model/user");
const bodyparser = require("body-parser");
const { register } = require("../model/user");
app.use(bodyparser.json());

// router.post('/login',async (req,res)=>{
//     const user = await User.findOne({email:req.body.email});
//     if(user){
//         if(user.validPassword(password)){
//             return res.status(201).send({
//                 message:"user logged in"
//             })
//         }
//         else{
//             return res.status(400).send({
//                 message:"wrong password"
//             })
//         }
//     }
//     else{
//         return res.status(400).send({
//             message:"user not found"
//         })
//     }

// })


// router.post('/signup',function(req,res){
//     let newUser =  new User();
//     // newUser.name = req.body.name;
//     console.log("hey");
//     console.log(req.body.email);
//     // console.log(req.body)
//     const password = req.body.password;
//     newUser.email = req.body.email;
//     // newUser.setPassword(password);
//     // newUser.password = bcrypt.hash(password,8);
  
//     newUser.save((err, User) => {
//         if (err) {
//             return res.status(400).send({
//                 message : "Failed to add user."
//             });
//         }
//         else {
//             return res.status(201).send({
//                 message : "User added successfully."
//             });
//         }
//     });
// })

// router.get("/login",function(req,res){
//       res.render(path.join(__dirname,"../views/login.ejs"))
// })
// router.get("/signup",function(req,res){
//     res.render("register")
// })
module.exports = router;