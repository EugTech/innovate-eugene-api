/*
    default service and temptate you can use.
    
*/
function ServiceRequest(request, response) {


    var fs = require('fs');


    const MASTERMAP_FILEPATH = SERVER.RootFolder + '/../DATA/MasterMap.json';

    fs.readFile(MASTERMAP_FILEPATH, 'utf8', function (err, contents) {
        
        if (err) {
            console.log(MASTERMAP_FILEPATH);
            response.end(JSON.stringify({
                msg: 'Mastermap not found!'
            }));

        } else {

            response.end(JSON.stringify({
                data: JSON.parse(contents)
            }));

        }

    });



}
exports.ServiceRequest = ServiceRequest;