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
function serveCorrectClient(req,cliRes,browserRes){
    if (!req.useragent.isDesktop)
        return cliRes
    else
        return browserRes
}

const base="/energy/api/";

//RESPONSES

app.get(base+":query/:area/:resolution/:durationOption/:year([0-9]{4})?:month(-[0-9]{2})?:day(-[0-9]{2})?:format(\&format=[a-z]{3,4})?",function(req,res){
    var flag=true;
    var params=req.params;
    [flag,params]=helpers.parser(params);
    var type=helpers.questionDecoder(params);
    helpers.query(params,type)
    res.send([params,req.params,type]);
    connection.query('SELECT "accessible" AS solution',function(err,res,fields){
        if (err) {console.log("Could not connect to SQL database.")} 
        else {console.log("Database is :" + res[0].solution)}
    });
});

app.get(base+":query/:area/:resolution/:durationOption",function(req,res){
        var flag=true;
        var params=req.params;
        [flag,params]=helpers.parser(params)
        res.send(["Query should contain a date type YYYY-MM-DD",params])
}); 

app.get(base+":query/:area/:resolution",function(req,res){
        var flag=true;
        var params=req.params;
        [flag,params]=helpers.parser(params)
        res.send(["Query should contain a duration field",params])
});
app.get(base+":query/:area",function(req,res){
        var flag=true;
        var params=req.params;
        [flag,params]=helpers.parser(params)
        res.send(["Query should contain resolution field",params])
});
app.get(base+":query",function(req,res){
    var flag=true;
    var params=req.params;
    [flag,params]=helpers.parser(params)
    res.send(["Query should contain area field",params])
});

app.get(base,function(req,res)
    {
        res.send("Welcome to our page!")
    }
    )
app.get("*",function(req,res)
{
    var flag=true;
    var params=req.params;
    [flag,params]=helpers.parser(params)
    res.send(["Error 404 : Page not found",params])
});

app.listen(8765, function(){
    console.log("Server Listening to port 8765");
}).on('error',console.log)
