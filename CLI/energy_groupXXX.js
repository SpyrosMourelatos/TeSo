const program = require('commander');
program.version('0.0.1');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

var input = process.argv;
var check = "";
var action;

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpPostAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function addScopeOptions(){
	program
			.requiredOption('--scope <scope>', 'ActualTotalLoad || AggregatedGenerationPerType || DayAheadTotalLoadForecast || ActualvsForecast')
			.requiredOption('--area <area>', 'Area name')
			.requiredOption('--timeres <timeres>', 'PT15M || PT30M || PT60M')
			.requiredOption('--apikey <apikey>', 'XXXX-XXXX-XXXX');
			if (input.toString().includes("date")){
				program.requiredOption('--date <date>', 'YYYY-MM-DD');
				check += "date";
			} else if (input.toString().includes("month")){
				program.requiredOption('--month <month>', 'YYYY-MM');
				check += "month";
			} else if (input.toString().includes("year")){
				program.requiredOption('--year <year>', 'YYYY');
				check += "year";
			} else {
				console.log("error: required option '--date <date>' not specified")
				check = "failed"
			}
		program
			.option('--prodtype <prodtype>', 'ProductionType.ProductionTypeText')
			.option('--format <format>', 'json (default) || csv', 'json');
}

function addUserOptions(){
	program
		.requiredOption('--passw <password>', 'User password')
		.requiredOption('--email <email>','User email')
		.requiredOption('--quota <quota>','User quota')
		.option('--userstatus <userstatus>','Username');
}

function addOptions(input){
	if (input.toString().includes("scope")){
		addScopeOptions();
		action = "scope"
		return;
	} else if (input.toString().includes("newuser")){
		program.requiredOption('--newuser <username>','Username for new user');
		addUserOptions();
		action = "newuser"
		return;
	} else if (input.toString().includes("moduser")){
		program.requiredOption('--moduser <username>','Username for new user');
		addUserOptions();
		action = "moduser"
		return
	}
}

function sendHTTP(action){
	var requestedURL = "http://localhost:8765/energy/api/"
	if (action === "scope"){
		requestedURL += program.scope + "/";
		requestedURL += program.area + "/";
		requestedURL += program.timeres + "/";
		if (check === "date"){
			requestedURL += program.date.substr(0, 4) + "/";
			requestedURL += program.date.substr(5, 2) + "/";
			requestedURL += program.date.substr(8, 2) + "/";
		} else if (check === "month"){
			requestedURL += program.month.substr(0, 4) + "/";
			requestedURL += program.month.substr(5, 2) + "/";
		} else if (check === "year"){
			requestedURL += program.year.substr(0, 4) + "/";
		} else {
			if (check !== "failed"){
				console.log("Error. Too many date formats added?");
				return;
			}
			return;
		}
		httpGetAsync(requestedURL, console.log);
	} else if (action === "newuser"){
		requestedURL +="";
		httpPostAsync(requestedURL, console.log);
	} else if (action === "moduser"){
		requestedURL +="";
		httpGetAsync(requestedURL, console.log);
	}


}


addOptions(input);
program.parse(input);
sendHTTP(action);