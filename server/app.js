var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var useragent=require("express-useragent");
var bodyParser = require('body-parser');
var path = require('path');
var ejs=require("ejs");
var helpers=require("./helpers.js");
const util = require('util');
  
//init sql connection
const configDb={
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'te_so'
}
const conn = mysql.createConnection(configDb);
const asyncQ=util.promisify(conn.query).bind(conn);


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

app.get(base+":Dataset/:area/:resolution/:durationOption/:year([0-9]{4})?:month(-[0-9]{2})?:date(-[0-9]{2})?:format(\&format=[a-z]{3,4})?",async function(req,res){
    var params=req.params;
    [flag,params]=helpers.parser(params);
    if (flag===false)
        res.status.send("403")
    const type=helpers.questionDecoder(params);
    var msg=await helpers.query(params,type,asyncQ);
    //if (params["format"]===0 && flag ===true)
        //msg=helpers.jsonToCsv(msg);
    whoReq=serveCorrectClient(req,"CLI","Browser");
    Object.assign(params,{WhoRequested:whoReq ,type:type} )
    res.send([params,msg]);
});

app.post(base+"users/new", function(req, res){
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.email);
    res.send("post route test");
});


app.get(base+":Dataset/:area/:resolution/:durationOption",function(req,res){
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

app.get(base,function(req,res){
        res.send("Welcome to our page!")
});

app.post(base+"new", function(req, res){
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.email);
    res.redirect(303, "/");
});

app.get("*",function(req,res){
    var flag=true;
    var params=req.params;
    [flag,params]=helpers.parser(params)
    res.send(["Error 404 : Page not found",params])
});

app.listen(8765, function(){
    console.log("Server Listening to port 8765");
}).on('error',console.log)
