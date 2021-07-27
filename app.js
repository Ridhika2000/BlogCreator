require('dotenv').config();
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(express.json());

app.use(express.urlencoded({extended:false}))
const mongoose = require("mongoose");
const ejs = require("ejs");
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
const _ =require("lodash");
const moment=require("moment");
const User = require("./model/user");
const Counter = require("./model/counter")
const cookieParser = require("cookie-parser")
const authenticate = require("./middlewares/Auth")
require("./config/db");


app.use(cookieParser());


// routes



app.get("/", function(req, res){
   res.render("home");
});

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/signup",
function(req,res){
res.render("register")
})

app.post('/login',async (req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email});
    
    if(user){
      const password = req.body.password;
        if(user.validPassword(password)){
          const token = await user.generateAuthToken();
          res.cookie("jwt",token,{
            expires:new Date(Date.now()+100000),
            httpOnly:true
          });
          res.redirect("/blogCreator/"+user.userId);
        }
        else{
            return res.status(400).send({
                message:alert('wrong password')
            })
        }
    }
    else{
        return res.status(400).send({
            message:"user not found"
        })
    }
  }
  catch(error){
    res.status(400).send(error);
  }
  

})
app.post('/signup', async (req,res)=>{
  try{
    await Counter.findOne({identifierName:"user"})
    .then(async(count)=>{
        if(count){
          const b=await Counter.findOneAndUpdate({identifierName:"user"},{$inc:{count:1}}, {new:true})
            
        }
        else{
            const counter=new Counter({
               identifierName:"user",
               count:1

            })
           const a=await counter.save()
        }
    })
    const counter=await Counter.findOne({identifierName:"user"})
    let count;
    if(!counter){
        count=1;
    }else{
        count=counter.count
    }
  
  let newUser =  new User();
  const password = req.body.password;
  newUser.email = req.body.email;
  newUser.userId = 'User-'+ count;
  newUser.setPassword(password);
  
  const token = await newUser.generateAuthToken();
  res.cookie("jwt",token,{
    expires:new Date(Date.now()+100000),
    httpOnly:true
  });
  
  newUser.save((err, User) => {
      if (err) {
        res.render("register");
      }
      else {
          res.redirect("/blogCreator/"+User.userId);
      }
  });
  }catch(error){
    res.status(400).send(error);
  }
 
})

app.get("/blogCreator/:userId",authenticate,
async (req,res)=>{
  const id = req.params.userId;
  const user = await User.find({bodyOfBlog:{$ne:null}});
  if(user){
    res.render("blogCreator", {moment:moment, postUsers:user,id:id});
  }
  else{
    console.log(err);
  }
})

app.get("/compose/:userId",authenticate, function(req, res){
  const id = req.params.userId;

    res.render("compose",{id:id});
  
 
});


app.post("/compose/:userId",authenticate,async (req, res)=>{
 
  const id = req.params.userId;

  const user = await User.findOne({userId:id});
  
  if(user){
    user.bodyOfBlog.push({title:req.body.postTitle , content:req.body.postBody})
       await user.save(function(){
          res.redirect("/blogCreator/"+id);
        });

  }
  else{
    console.log('error');
  }
})

app.get("/users/:userId/bodyOfBlog/:blogId",authenticate,async (req, res)=>{
  var userID=(req.params.userId);
  var blogID=(req.params.blogId);

  const user = await User.findOne({userId:userID});
  if(user){
    var title,body,i;
    
    for(i=0;i<user.bodyOfBlog.length;i++){
      
      if(user.bodyOfBlog[i]._id==blogID){
        
         title = user.bodyOfBlog[i].title;
         body = user.bodyOfBlog[i].content
      }
    }
    console.log(title);
    res.render("post",{
      requestedTitle:title,
      requestContent:body,
      id:userID
    })
  }
  else{
    res.status(400).json({
      message:'no user exist'
    })
  }
  
 
});


app.get("/logout/:userId",authenticate, async (req, res)=>{
  req.user.tokens = req.user.tokens.filter((currElement)=>{
    return currElement.token != req.token
  })
  res.clearCookie("jwt");
  await req.user.save();
  console.log(req.user)
  res.redirect("/");
});

app.get('/contact/:userId',authenticate,async(req,res)=>{
  const id = req.params.userId;
  res.render('contact',{id:id});
})

app.get('/about/:userId',authenticate,async(req,res)=>{
  const id = req.params.userId;
  res.render('about',{id:id});
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});


