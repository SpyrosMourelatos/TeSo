var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var useragent=require("express-useragent");
var bodyParser = require('body-parser');
var path = require('path');
var ejs=require("ejs");
var helpers=require("./helpers.js");
//init sql connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'te_so'
});

//test connection with sql
connection.query('SELECT "accessible" AS solution',function(err,res,fields){
    if (err) {console.log("Could not connect to SQL database.")} 
    else {console.log("Database is :" + res[0].solution)}
});
//init express 
var app = express();
app.use(useragent.express());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//This func takes a request and two possible responses and it decides which to send back based on client
function serveCorrectClient(req,cliRes,browserRes)
{

    if (!req.useragent.isDesktop){return cliRes}
    else {return browserRes}
}


var base="/energy/api/";


//RESPONSES
app.get(base+"ActualTotalLoad/:area/:resolution/:year/:month/:day",function(req,res)
    {
        var flag=true;
        var params=req.params;
        [flag,params]=helpers.parser(params)

        res.send([flag,params]);
        connection.query('SELECT "accessible" AS solution',function(err,res,fields){
            if (err) {console.log("Could not connect to SQL database.")} 
            else {console.log("Database is :" + res[0].solution)}

        });
    })
    app.get("*",function(req,res){res.send("Error 404 : Page not found")});

    app.listen(8765, function(){
        console.log("Server Listening to port 8765");
    }).on('error',console.log)
