var mongoose = require("mongoose");

// Create Schema class

var Schema = mongoose.Schema;

// Create  schema

var ArticleSchema = new Schema({

  // headlines
  headline: {

    type: String,

    required: true

  },

  // 

  summary: {

    type: String,

    required: true

  },

  // url is a required string

  url: {

    type: String,

    required: true,

    unique: true

  },

  // + <?>

  comments: [

    {

      type: Schema.Types.ObjectId,

      ref: "Comment"

    }

  ]

});

// Create the Article model with the ArticleSchema

var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;