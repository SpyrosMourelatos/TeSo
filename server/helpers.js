

module.exports ={
    //compare a string with a list of strings and returns the index if they equal else return false
    compareString : function(str,list) {
        var i = 0
        for(i; i<list.length; i++) 
        {    
        if(str=== list[i]) return [i+1,list[i]];
        }
        return [false,false]
    },
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
            //Sory for the big line it will get smaller
            var [index,elem] = module.exports.compareString(params["query"],["ActualTotalLoad","AggregatedGenerationPerType","DayAheadTotalLoadForecast"])
            if (index===false)
            {
                ret[1]="Query Paramter should be one of the three values:ActualTotalLoad,AggregatedGenerationPerType,DayAheadTotalLoadForecast";
                return [false,ret];
            }
            Object.assign(ret,{query :index })
        }
        if ('area' in params)
        {
            Object.assign(ret,{area :params["area"] })
        }
        if ('resolution' in params) 
        {
            var [index,elem] = module.exports.compareString(params["resolution"],["PT60M","PT30M","PT15M"])
            if (index===false)
            {
                ret[1]="Resolution Paramter should be one of the three values:PT60M,PT30M,PT15M";
                return [false,ret];
            }
            Object.assign(ret,{resolution :index })
        }
        if ('durationOption' in params) 
        {
            var [index,elem] = module.exports.compareString(params["durationOption"],["date","month","year"])
            console.log(index)
            if (index===false)
            {
                console.log("If its false i am in")
                ret[1]="Duration Paramter should be one of the three values:year,month,day";
                return [false,ret];
            }
            Object.assign(ret,{durationOption:elem })

        }
        if (!(  params['year'] ===undefined))
        {
            const temp=module.exports.checkNumerics(params["year"],1900,4200)
            if (temp[1]==false) {return [false,temp[0]] ;}
            Object.assign(ret,{ year : temp[0] } )
        }
        if (!(  params['month'] ===undefined))
        {
            const temp=module.exports.checkNumerics(params["month"],0,13)
            if (temp[1]==false) {return [false,temp[0]] ;}
            Object.assign(ret,{ month : temp[0] } )
        }
        if (!(  params['day'] ===undefined))
        {
            const temp=module.exports.checkNumerics(params["day"],0,32)
            if (temp[1]==false) {return [false,temp[0]] ;}
            Object.assign(ret,{ day : temp[0] } )
        }
        if (params["format"]==="&format=csv") Object.assign(ret,{format:1})
        else  Object.assign(ret,{format:0})
        return [true,ret];
    },

    questionDecoder :function (params)
    { 
        var dur=params["durationOption"]
        const hasY=('year' in params)
        const hasM=('month' in params)
        const hasD = ('date' in params) 
        

        if (params["durationOption"]==="year" && ( !(hasY) || hasM || hasD ) ) return "Query needs only year"
        else if (params["durationOption"]==="months" &&  ( !(hasY) || !(hasM) || hasD )) return "Query needs year and month"
        else if (params["durationOption"]==="date" &&  ( !(hasY) || !(hasM) || !(hasD) )) return "Query needs year and month"
        else return params["query"]+params["durationOption"]
    },

    queries : function(params,type)
    {
        //IMPLEMENTATION IS FOR GIRLS
        if  (type=="1year")
            {}
        else if (type=="1month")
            {}
        else if (type=="1date")
            {}
        else if (type=="2year")
            {}
        else if (type=="2month")
            {}
       else if (type=="2date")
            {} 
        else if (type=="3year")
            {}
        else if (type=="3month")
            {}
       else if (type=="3date")
            {} 
                
        
    }

}