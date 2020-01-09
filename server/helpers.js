

module.exports ={
    //Thid func takes strings and checks if they are inegers in a range
    checkNumerics: function checkNumerics(maybeNumber,min,max)
    {
        maybeNumber=parseFloat(maybeNumber);
        maybeNumber=Math.abs(maybeNumber);
        if (Number.isInteger(maybeNumber))
        {
            if (maybeNumber <= min || maybeNumber >=max)
            {
                return ["Number out of range ,should be between ("+min+","+max+")",false];
            }
            else return [maybeNumber,true];
        }

        else 
            return ["is not an integer.It should be in  range("+min+","+max+")",false];
    },
    

    //takes the parameters of an http req ,
    //typecheks them and modifies them to be ready for the querries 
    //returns [bool,params]
    parser : function (params)
    {
        var ret={};
        if ( 'query' in params)
        {
            if (   params["query"] === "ActualTotalLoad" )
            {Object.assign(ret,{query :1 })}
            else if ( params["query"] === "AggregatedGenerationPerType" )
            {Object.assign(ret,{query :2 })}
            else if (params["query"] === "DayAheadTotalLoadForecast")
            {Object.assign(ret,{query :3 })}
            else 
            {
                ret[1]="Query Paramter should be one of the three values:ActualTotalLoad";
                return [false,ret];
            }
        }
        if ('area' in params)
        {
            Object.assign(ret,{area :params["area"] })
        }
        if ('resolution' in params) 
        {
            if (   params["resolution"] === "PT60M" )
            {Object.assign(ret,{resolution :1 })}
            else if ( params["resolution"] === "PT30M" )
            {Object.assign(ret,{resolution :2 })}
            else if (params["resolution"] === "PT15M")
            {Object.assign(ret,{resolution :3 })}
            else 
            {
                ret[1]="Resolution Paramter should be one of the three values:PT60M,PT30M,PT15M";
                return [false,ret];
            }
        }
        if ('durationOption' in params) 
        {
            if (   params["durationOption"] === "date" )
            {Object.assign(ret,{durationOption :1 })}
            else if ( params["durationOption"] === "month" )
            {Object.assign(ret,{durationOption :2 })}
            else if (params["durationOption"] === "year")
            {Object.assign(ret,{durationOption :3 })}
            else 
            {
                ret[1]="Duration Paramter should be one of the three values:year,month,day";
                return [false,ret];
            }
        }
        if ('year' in params)
        {
            const temp=module.exports.checkNumerics(params["year"],1900,4200)
            if (temp[1]==false) {return [false,temp[0]] ;}
            Object.assign(ret,{ Year : temp[0] } )
        }
        if ('month' in params)
        {
            const temp=module.exports.checkNumerics(params["month"],0,13)
            if (temp[1]==false) {return [false,temp[0]] ;}
            Object.assign(ret,{ Month : temp[0] } )
        }
        if ('day' in params)
        {
            const temp=module.exports.checkNumerics(params["day"],0,32)
            if (temp[1]==false) {return [false,temp[0]] ;}
            Object.assign(ret,{ Day : temp[0] } )
        }
        if ('format' in params)
        {
            if (params["format"]==="&format=json")
            Object.assign(ret,{format:1})
            else if (params["format"]==="&format=csv")
            Object.assign(ret,{format:2})
        }
        else Object.assign(ret,{format:1})

        return [true,ret];
    }

}
