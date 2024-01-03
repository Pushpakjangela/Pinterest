
var express = require('express');
var router = express.Router();
const userModel =  require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require('./multer');


passport.use(new localStrategy(userModel.authenticate()));


router.get("/", function (req, res, next) {
  res.render("index");
});


//-------------------------data association--------------------//
/* 


router.get("/createuser",async function(req,res){
  const createduser =await userModel.create({
    username:"Pushpak",
    password:"pushpak",
    posts:[],
    email:"pushpak@123.com",
    fullname:"pushpak jangela"
  })
  res.send(createduser);
})
router.get("/alluser",async function(req,res){
  let user = await userModel
    .findOne({ _id: "6553c879a98d4d8b80206fba" })
    .populate('posts');
  res.send(user);
})
router.get("/createpost",async function(req,res){
  let createdposts = await postModel.create({
    postText: "chale ja bhsdk",
    user: "6553c879a98d4d8b80206fba",
  });
  let user=await userModel.findOne({_id:"6553c879a98d4d8b80206fba"});
  user.posts.push(createdposts._id);
  await user.save();
  res.send("done");
})*/


// profile page ;-
router.get("/profile",isLoggedIn,async function(req,res,next){
  let user = await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("posts")
  res.render("profile",{user});
})

 // register :-

 router.post("/register",function(req,res){
  // const userdata = new userModel({
  //   username:req.body.username,
  //   email:req.body.email,
  //   fullname:req.body.fullname
  // })

  //method-----2
  const {username,email,fullname}=req.body;
  const userdata=new userModel({username,email,fullname});

  userModel.register(userdata,req.body.password)
    .then(function(){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile");
      })
    })
   
 })

 // login
router.get("/login",function(req,res){
  res.render('login',{error:req.flash('error')});
})

 router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
 }),function(req,res){

 })

router.get("/feed",function(req,res){
  res.render("feed");
})

 //logout:-
 router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/');
  })
 })
 
 function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
 }

 //upload router post method :-

 router.post("/upload",isLoggedIn,upload.single("file"),async function(req,res,next){
  if(!req.file){
    res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  const post = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user : user._id
  })
  user.posts.push(post._id)
  await user.save()

  res.redirect("profile")

 })



module.exports = router;
