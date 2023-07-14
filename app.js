const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

/////////////////Targetting all articles////////////////////////////

 ////chained route handlers each function starts with dot//////////////////////////////////////////

app.route("/articles")

.get(function(req,res){
  Article.find(function(err,articles){
    if(!err){
      res.send(articles);
    }
    else{
      res.send(err);
    }

  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("New article added!")
    }else{
      res.send(err);
    }
  });
})

  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Deleted all articles");
      }else{
        res.send(err);
      }
    });
    });
//////////////////////////////////////////////////////////////////////


/////////////////Targetting a specific article////////////////////////////

app.route("/articles/:articleTitle")     //https://www.w3schools.com/tags/ref_urlencode.ASP  refer to see how space n stuff are encoded when we have to send post requests Lec373 14'

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err,article){
    if(article){
      res.send(article);
    }
    else{
      res.send("No article found");
    }

  });
})

.put(function(req,res){
  Article.replaceOne(
    {title: req.params.articleTitle}, //condition
    {title: req.body.title, content: req.body.content},   //updates
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Article updated successfully");
      }
    }
  );

})

.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle}, //condition
    {$set: req.body},   //chooses what all needs to be updated an updates
    function(err){
      if(!err){
        res.send("Article updated successfully");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    { title: req.params.articleTitle },
    function(err){
      if(!err){
        res.send("Article deleted successfully");
      }else{
        res.send(err);
      }
    }
  );
});


app.listen(3000, function() {
  console.log("server started on port 3000");
});
