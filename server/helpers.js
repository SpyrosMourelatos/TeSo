
//compare a string with a list of strings and returns the index if they equal else return false
function compareString(str,list){
    var i = 0
    for(i; i<list.length; i++) 
        if(str=== list[i]) 
            return [i+1,list[i]];
    return [false,false]
}
//Thid func takes strings and checks if they are inegers in a range
function checkNumerics(maybeNumber,min,max){
    maybeNumber=parseFloat(maybeNumber);
    maybeNumber=Math.abs(maybeNumber);
    if (Number.isInteger(maybeNumber)){
        if (maybeNumber <= min || maybeNumber >=max)
            return ["Number out of range ,should be between ("+min+","+max+")",false];
        else 
            return [maybeNumber,true];
    }
    else 
        return ["is not an integer.It should be in  range("+min+","+max+")",false];
}
//Checks if duration option matches duration inputs and returns query type
function questionDecoder(params){ 
    const dur=params["durationOption"]
    const hasY=('year' in params)
    const hasM=('month' in params)
    const hasD = ('date' in params) 
    
    if (params["durationOption"]==="year" && ( !(hasY) || hasM || hasD ) ) return "Query needs only year"
    else if (params["durationOption"]==="months" &&  ( !(hasY) || !(hasM) || hasD )) return "Query needs year and month"
    else if (params["durationOption"]==="date" &&  ( !(hasY) || !(hasM) || !(hasD) )) return "Query needs year, month and date"
    else return params["query"]+dur
}
function query(params,type){
    //IMPLEMENTATION IS FOR GIRLS
    switch (type){
        case "1year":
        return;
        case "1month":
        return;
        case "1date":
        return;
        case "2year":
        return;
        case "2month":
        return;
        case "2date":
        return;
        case "3year":
        return;
        case "3month":
        return;
        case "3date":
        return;
    }
}
//takes the parameters of an http req ,
//typecheks them and modifies them to be ready for the querries 
//returns [bool,params]
function parser(params){
    var ret={};
    if ( 'query' in params){
        //Sory for the big line it will get smaller
        const queryParams=["ActualTotalLoad","AggregatedGenerationPerType","DayAheadTotalLoadForecast"]
        const [index,_] =  compareString(params["query"],queryParams)
        if (index===false){
            ret[1] = "Query Parameter should be one of the three values: ActualTotalLoad,"
                   + " AggregatedGenerationPerType, DayAheadTotalLoadForecast";
            return [false,ret];
        }
        Object.assign(ret,{query :index })
    }
    //No reason for this check but afterwards we can sql check it 
    if ('area' in params){
        Object.assign(ret,{area :params["area"] })
    }
    if ('resolution' in params) {
        const queryParams=["PT60M","PT30M","PT15M"]
        const [index,_] = compareString(params["resolution"],queryParams)
        if (index===false){
            ret[1]="Resolution Parameter should be one of the three values: PT60M, PT30M, PT15M";
            return [false,ret];
        }
        Object.assign(ret,{resolution :index })
    }
    if ('durationOption' in params) {
        const queryParams=["date","month","year"]
        var [index,elem] = compareString(params["durationOption"],queryParams)
        if (index===false){
            ret[1]="Duration Parameter should be one of the three values: year, month, day";
            return [false,ret];
        }
        Object.assign(ret,{durationOption:elem })
    }
    if ( params['year'] != undefined ){
        const temp=checkNumerics(params["year"],1900,4200)
        if (temp[1]==false) 
            return [false,temp[0]] ;
        Object.assign(ret,{ year : temp[0] } )
    }
    if ( params['month'] != undefined ){
        const temp=checkNumerics(params["month"],0,13)
        if (temp[1]==false) 
            return [false,temp[0]] ;
        Object.assign(ret,{ month : temp[0] } )
    }
    if ( params['day'] != undefined ){
        const temp= checkNumerics(params["day"],0,32)
        if (temp[1]==false) 
            return [false,temp[0]] ;
        Object.assign(ret,{ day : temp[0] } )
    }
    if ( params["format"]!="&format=csv" ) 
        Object.assign(ret,{format:1})
    else  
        Object.assign(ret,{format:0})
    return [true,ret];
}
//Export all the module
module.exports.parser=parser;
module.exports.questionDecoder=questionDecoder;
module.exports.query=query;
module.exports.compareString=compareString;
module.exports.checkNumerics=checkNumerics;