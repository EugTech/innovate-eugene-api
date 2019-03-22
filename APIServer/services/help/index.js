
function ServiceRequest(request, response) {

    function SendError(ErrorMSG) {
        response.end(JSON.stringify({
            err: ErrorMSG
        }));
    }

    try {

        const reqData = request.RequestData;

        

        if (!reqData.topic) {
            SendError('Please supply a topic!');
        } else {


            SendError('Ok now write help about this topic <b>'+reqData.topic+'<b>! lol');

        }

    }
    catch (errorService) {

        SendError(errorService.message);

    }


}
exports.ServiceRequest = ServiceRequest;