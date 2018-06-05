var express = require("express");
var app = express();
var request = require('request');
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("view engine", "ejs")

app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
//app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.

app.get("/home", function(req, res){
    res.render("home");
    console.log("home page");
});

//app.listen(process.env.PORT, process.env.IP, function(){
 //  console.log("Serving in PORT: "+ process.env.PORT); 
//});

app.listen(PORT, function () {
  console.log('Server running...');
}); 