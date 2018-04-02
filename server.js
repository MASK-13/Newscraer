var express = require("express");

var exphbs = require ("express-handlebars");

var mongoose = require ("body-parser");

var cheerio = require ("cheerio");

var request = require ("request");

// M O D

var Article = require("./models/Article");

var Comment = require("./models/Comment");

// M JS ES6
mongoose.Promise = Promise;

// init
var app = express ();
var port = process.env.PORT || 3000;


// App bodyP

app.use(bodyParser.urlencoded({
	extended: false
}));

app.engine("handlebars",exphbs ({ defaultlayout: "main"}));
app.set("view engine", "handlebars");



app.use(express.static("public"));
app.use(express.static("public"));



//  mongoose

// db: newsscraper

mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds127802.mlab.com:27802/newsscraper");


var db = mongoose.connection;


db.on("error", function(error) {

  console.log("Mongoose Error: ", error);

});



// Log a success message when we connect to our mongoDB collection with no issues

db.once("open", function() {

  console.log("Mongoose connection successful.");

});


// Routes


app.get("/", function(req, res) {



  Article.find()

    .exec( function(err, articles) {

      res.render("index",{

        articles

      });

    });

});



//

app.get("/scrape", function(req, res) {



  request("http://www.npr.org/sections/news/", function(error, response, html) {


    var $ = cheerio.load(html);


    $("div.item-info").each(function(i, element) {

      console.log(element);

      var result = {};


      result.headline = $(this).children("h2").children("a").text();

      result.summary = $(this).children("p.teaser").text();

      result.url = $(this).children("h2").children("a").attr("href");



      var entry = new Article(result);

      console.log(entry);



      if(!(result.headline.length === 0 || result.url.length === 0)) {

        entry.save(function(err, doc) {

          

          if (err) {

            console.log(err);

          }

         

          else {

            console.log("Saved:",doc);

          }

        });

      }

    });

  });



  res.send("Scrape Complete");

});





app.get("/article/:id", function(req, res) {



  Article.findOne({_id: mongoose.mongo.ObjectId(req.params.id)})

    .populate("comments")

    .exec( function(err, article) {

      if(err) {

        res.send(err);

      } else {

        console.log(article);

        res.render("article", {

          article

        });

      }

    });



});


app.post("/article/:id", function(req, res) {

  console.log("REQ BODY:", req.body);

  let newComment = new Comment(req.body);



  newComment.save( function(err, comment) {

    if(err){ 

      res.send(err);

    } else {

      Article.findOneAndUpdate({_id: mongoose.mongo.ObjectId(req.params.id)}, { $push: { comments: comment._id } }, function(err, article) {

        if(err){ 

          res.send(err);

        } else {

          res.redirect("/article/" + req.params.id);

        }

      });

    }

  });

});


// LISTEN 

app.listen(port, function() {

  console.log("App running on port 3000!");

});