var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var useragent=require("express-useragent");
var bodyParser = require('body-parser');
var path = require('path');
var ejs=require("ejs");

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

function checkNumerics(maybeNumber,min,max)
    {
    if (Number.isInteger(maybeNumber))
        {
            if (maybeNumber <min || maybeNumber >max)
            {
            return ["Number out of range ,should be between ("+min+","+max+")",false];
            }
            else return [maybeNumber,true];
        }

    else 
        return ["is not an integer.It should be in  range("+min+","+max+")",false];
    }

//takes the parameters of an http req ,
//typecheks them and modifies them to be ready for the querries 
//returns [bool,params]
function editParams(params)
    {
    var ret=[true ,""];
    if ('resolution' in params) 
        {
        if (   params["resolution"] === "PT60M" )
            {ret[1]=ret[1]+"1"}
        else if ( params["resolution"] === "PT30M" )
            {ret[1]=ret[1]+"2"}
        else if (params["resolution"] === "PT15M")
            {ret[1]=ret[1]+"3"}
        else 
            {
            ret[0]=false;
            ret[1]="Resolution Paramter should be one of the three values:PT60M,PT30M,PT15M";
            return ret;
            }
        }
    if ('year' in params)
            {
                const temp=checkNumerics(params["year"],1900,4200)
                ret[0]=temp[1]
                ret[1]="Year "+temp[0];
                return ret ;
            }
    if ('month' in params)
        {
                const temp=checkNumerics(params["month"],0,13)
                ret[0]=temp[1]
                ret[1]=ret[1]+"Month "+temp[0];
                return ret ;
        }
    if ('day' in params)
        {
                const temp=checkNumerics(params["day"],0,32)
                ret[0]=temp[1];
                ret[1]="Day "+temp[0];
                return ret;
        }
        return ret;
    }
var base="/energy/api/";


//RESPONSES
app.get(base+"ActualTotalLoad/:area/:resolution/:year/:month/:day",function(req,res)
    {
    var params=req.params;
    console.log(typeof(params["year"]))
    console.log("-------------\n\n\n\n\n\n\n\n\n\n\n")
    params=editParams(params)
    res.send(params);
    
    });
app.get("*",function(req,res){res.send("Error 404 : Page not found")});

app.listen(8765, function(){
	console.log("Server Listening to port 8765");
}).on('error',console.log);
