var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});


var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname +'/public/')); 

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/signup.html'));
});
app.post('/sign_up', function(req,response){ 
   	var name = req.body.name; 
   	var email =req.body.email; 
   	var pass = req.body.password; 

	connection.query("INSERT INTO accounts (`username`, `password`, `email`) VALUES (?,?,?)",[name,email,pass],
		function(err,response,fields){ 

       		 if (err) throw err; 
        	console.log("Record inserted Successfully"); 
              
    		}); 
          
    return response.sendFile(path.join(__dirname +'/signup_success.html')); 
}) ;

app.listen(3000);

