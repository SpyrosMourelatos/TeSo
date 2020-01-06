

module.exports ={
    //Thid func takes strings and checks if they are inegers in a range
    checkNumerics: function checkNumerics(maybeNumber,min,max)
    {
        maybeNumber=parseFloat(maybeNumber)
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
        return [true,ret];
    }

}
