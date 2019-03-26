const topics = {

};

function ServiceRequest(request, response) {



    try {

        const reqData = request.RequestData.data;



        if (!reqData.topic) {

            response.SendError(response, {
                err: 'Please supply a topic!'
            });

        } else {

            response.end(JSON.stringify({
                msg: 'Ok now write help about this topic <b>' + reqData.topic + '<b>! lol'
            }));

        }

    }
    catch (errorService) {
        response.SendError(response, {
            err: errorService
        });


    }


}
exports.ServiceRequest = ServiceRequest;