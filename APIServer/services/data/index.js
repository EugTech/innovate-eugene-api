/*
    default service and temptate you can use.
    
*/
function ServiceRequest(request, response) {
    const result = {
        debug: null // put what you need in here...
    };

    const SQL = "SELECT * FROM `asset-inventory`.AllAssets limit 50;";
    SERVER.SqlData.ExecuteSQL(SQL, function (Result) {
        if (Result.err) {
            result.err = Result.err;
            debugger;
        } else {
            result.data = Result.rows;
        }
        response.end(JSON.stringify(result));
    });
}
exports.ServiceRequest = ServiceRequest;