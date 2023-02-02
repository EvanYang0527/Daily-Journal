//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my Personal Blog Website DAILY JOURNAL :) This is a full stack project that applied HTML, CSS(Bootstrap), JavaScript on the frontend and node.js, express, MongoDB on the backend. As you can see, the web was designed and implemented with the same style among pages by using ejs. The web app is hosted on Heroku and the database is hosted on MongoDB Atlas. Please feel free to compose a new blog as avcomment by clicking the top right COMPOSE button! If the blog message is too long, only the first 100 characters will be shown and there should be a READ MORE button at the end to redirect to a new message page.";
const aboutContent = "Hello :) My name is Yifan Evan Yang. I am currently a master’s student majoring in Computer Science at University of Southern California, School of Engineering.";
const contactContent = "I look forward to elaborating on how my specific skills and abilities will benefit your project. Please contact me via email at yyang466@usc.edu to arrange for a convenient meeting time.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://YifanYang:<password>@cluster0.lccbw8k.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started");
});
