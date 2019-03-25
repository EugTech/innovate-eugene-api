/*
    default service and temptate you can use.
    
*/
const MySQLDataModel = {
    test(Result, Request, Response) {
        const SQL = "SELECT * FROM `asset-inventory`.AllAssets limit 50;";
        SERVER.SqlData.ExecuteSQL(SQL, function (SQLResult) {
            if (SQLResult.err) {
                Result.err = SQLResult.err;
                debugger;
            } else {
                Result.data = SQLResult.rows;
            }
            Response.end(JSON.stringify(Result));
        });
    },
    AllAssets(Result, Request, Response) {
        const SQL = "SELECT * FROM `asset-inventory`.AllAssets limit 30;";
        SERVER.SqlData.ExecuteSQL(SQL, function (SQLResult) {
            if (SQLResult.err) {
                Result.err = SQLResult.err;
                debugger;
            } else {
                Result.data = SQLResult.rows;
            }
            Response.end(JSON.stringify(Result));
        });
    }    ,
    TableTotals(Result, Request, Response) {
        const SQL = "SELECT count(*) TotalAssets FROM `asset-inventory`.AllAssets limit 30;";
        SERVER.SqlData.ExecuteSQL(SQL, function (SQLResult) {
            if (SQLResult.err) {
                Result.err = SQLResult.err;
                debugger;
            } else {
                Result.data = SQLResult.rows;
            }
            Response.end(JSON.stringify(Result));
        });
    }      
};


function ServiceRequest(request, response) {

    /*
        Now if your chance to setup a default record for this service...
    */
    const result = {
        debug: null // put what you need in here...
    };
    
    
    //Debug  - Let us know what the client sent...
    // console.log(request.RequestData);/


    if (!request.RequestData.view) {
        response.end(JSON.stringify({
            err: 'No View!'
        }));
        return;
    }

    //See if we can support the view requested from the client....
    const modelViewService = MySQLDataModel[request.RequestData.view];
    if (!modelViewService) {
        response.end(JSON.stringify({
            err: 'View "' + request.RequestData.view + '" Not Found!'
        }));
    } else {
        modelViewService(result, request, response);
    }


}
exports.ServiceRequest = ServiceRequest;