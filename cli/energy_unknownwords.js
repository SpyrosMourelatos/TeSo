const program = require('commander');
var request = require('request');
var fs = require('fs');
var FormData = require('form-data');

program.version('0.0.1');

var rawInput = process.argv;
var check = "";
var action;
var httpRequestStatus;
var baseURL = "http://localhost:8765/energy/api/"
var input = rawInput.toString().slice(rawInput.toString().search(/energy_unknownwords/), rawInput.toString().length);

//Send http GET request
function httpGetAsync(theURL, callback){
    request(theURL, function (error, response, body) {
	  callback(body);
	});
}

//Send http POST request
function httpPostAsync(theURL, type, data){
	if (type === "user"){
		request.post({
			url: theURL, 
			form: {
		    	username: data.username,
		    	email: data.email,
		    	password: data.password
		    }}, 
		    function(error, response, body){ 
				if (!error/* && response.statusCode == 200*/) {
			    	console.log("Your request has been successful");
			    	httpRequestStatus = true;
			    } else {
			    	console.log("An error occured. Error details:");
			    	console.log(error);
			    	httpRequestStatus = false;
			    }
		});
	} else if (type === "file"){
		var fileStream = fs.createReadStream("testFile.txt");
		var form = new FormData();
		form.append('file', fs.createReadStream('testFile.txt'));
		form.submit(theURL, function(err, res) {
			if (!err){
				console.log(res);
			} else {
				console.log("Something went wrong. Here is the error in more detail:\n"+err);
			}
		});
	};
}

function httpPutAsync(theURL, data){
	request.put({
		url: theURL, 
		form: {
	    	username: data.username,
	    	email: data.email,
	    	password: data.password
		}},
	    function(error, response, body){ 
			if (!error/* && response.statusCode == 200*/) {
		    	console.log("Your request has been successful");
		    	console.log("Server response: " + response.body);
		    	httpRequestStatus = true;
		    } else {
		    	console.log("An error occured. Error details:");
		    	console.log(error);
		    	httpRequestStatus = false;
		    }
	});
};

//Add required params if input is "scope"
function addScopeOptions(){
	if (input.includes("date")){
			program.requiredOption('--date <date>', 'YYYY-MM-DD');
			check += "date";
		} else if (input.includes("month")){
			program.requiredOption('--month <month>', 'YYYY-MM');
			check += "month";
		} else if (input.includes("year")){
			program.requiredOption('--year <year>', 'YYYY');
			check += "year";
		} else {
			console.log("error: required option '--date <date>' not specified")
			check = "failed"
			return;
		}
	program
		.requiredOption('--area <area>', 'Area name')
		.requiredOption('--timeres <timeres>', 'PT15M || PT30M || PT60M')
		.requiredOption('--apikey <apikey>', 'XXXX-XXXX-XXXX');
	if (input.includes("AggregatedGenerationPerType")){
		program.requiredOption('--prodtype <prodtype>', 'ProductionType.ProductionTypeText');
	} else {
		program.option('--prodtype <prodtype>', 'ProductionType.ProductionTypeText')
	}
	program.option('--format <format>', 'json (default) || csv', 'json');
}

//Add required params if input is "newuser" or "moduser"
function addUserOptions(){
	program
		.requiredOption('--passw <password>', 'User password')
		.requiredOption('--email <email>','User email')
		.requiredOption('--quota <quota>','User quota')
		.option('--userstatus <username>','Username');
}

//Decide which set of params to add
function addOptions(string){
	program.requiredOption('--scope <scope>', 'ActualTotalLoad || AggregatedGenerationPerType || DayAheadTotalLoadForecast || ActualvsForecast || Admin');
	if (!string.toLowerCase().includes("admin")){
		action = "scope"
		addScopeOptions();
		return;
	} else if (input.includes("newuser")){
		action = "newuser"
		program.requiredOption('--newuser <username>','Username for new user');
		addUserOptions();
		return;
	} else if (input.includes("moduser")){
		action = "moduser"
		program.requiredOption('--moduser <username>','Username of user');
		addUserOptions();
		return;
	} else if (input.includes("newdata")){
		action = "newdata";
		program.requiredOption('--newdata <dataType>', 'Data to be added to the database');
		program.requiredOption('--source <fileName>', 'CSV file to add to database');
		return;
	} else {
		console.log("Accepted parameters with --scope Admin include:\n  --newuser <username>\n  --moduser <username>\n  --newdata <dataType>\ntype --help for more info");
	}
}

//Create a url and send appropriate http request
function sendHTTP(action){
	if (action === "scope"){
		baseURL += program.scope + "/";
		baseURL += program.area + "/";
		baseURL += program.timeres + "/";
		baseURL += check + "/";
		if (check === "date"){
			baseURL += program.date.substr(0, 4) + "-";
			baseURL += program.date.substr(5, 2) + "-";
			baseURL += program.date.substr(8, 2);
		} else if (check === "month"){
			baseURL += program.month.substr(0, 4) + "-";
			baseURL += program.month.substr(5, 2);
			//Server side "null" code
			//baseURL += "00/";
		} else if (check === "year"){
			baseURL += program.year.substr(0, 4);
			//Server side "null" code
			//baseURL += "00/";
			//baseURL += "00/";
		}
		if (program.format === "json" || program.format === "csv"){
			baseURL += "&format="+program.format;
		}
		httpGetAsync(baseURL, console.log);
	} else if (action === "newuser"){
		baseURL += "users/new/"
		httpPostAsync(baseURL, "user", {
			username: program.newuser,
			email: program.email,
			password: program.passw
		});
		if (httpRequestStatus/* === 200 or 303 or something the like*/){
			console.log("Success!")
			console.log("Use the --moduser parameter to modify user info.")
		}
	} else if (action === "moduser"){
		var userID = program.apikey;
		baseURL +="users/" + userID;
		httpPutAsync(baseURL, "user",{
			username: program.moduser,
			email: program.email,
			password: program.passw
		});	
	} else if (action === "newdata"){
		baseURL += "upload/";
		httpPostAsync(baseURL, "file", {
			path: program.source
		});
	}
}

//Making a helpful and nice looking --help command
program.on('--help', function(){
	console.log("");
	console.log("  --scope     defines search scope");
	console.log("");
	console.log("  the following parameteres are reqired with --scope <value>:")
	console.log("  	--date      defines search date");
	console.log("  	--area      defines search area");
	console.log("  	--timeres   defines search time resolution");
	console.log("  	--apikey    who knows?");
	console.log("");
	console.log("  the following parameteres are optional with --scope <value>:")
	console.log("  	--prodtype  defines search production type");
	console.log("  	--format    determines a .json or .csv response formating");
	console.log("");
	console.log("  the following parameteres are accepted ONLY with --scope \"Admin\":")
	console.log("  	--newuser     creates a new user");
	console.log("  	--moduser     modifies existing user");
	console.log("  	--newdata     new entry to be added to the database");
	console.log("");
	console.log("  the following parameteres are reqired with --newuser or --moduser:");
	console.log("  	--passw      user password");
	console.log("  	--email      user email");
	console.log("  	--quota      available queries remaining");
	console.log("");
	console.log("  the following parameteres are optional with --newuser or --moduser");
	console.log("  	--userstatus check user's status");
	console.log("");
	console.log("  the following parameteres are reqired with --newdata:");
	console.log("  	--source     file source to be uploaded");
});

//Code execution starts here
if(input === "energy_unknownwords" || input === "energy_unknownwords.js"){
	console.log("Type --help for a list of commands");
} else {
	addOptions(input);
	program.parse(rawInput);
	sendHTTP(action);
}