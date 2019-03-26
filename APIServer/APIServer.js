#!/usr/bin/env node

"use strict";



/*
    Main entry point for the "/api" proxy app.

    http://127.0.0.1:9118


 
*/

global.SERVER = {
    Started: new Date(),
    RootFolder: __dirname
}

//Load up our mysql server code....
SERVER.SqlData = require('../LIB/MySQLData');


/*
    Get the appinfo from the `package.json` file and 
    add any "extra" info the app needs to survive... :-) 
*/

const fs = require('fs');
const path = require('path');


/*
    Basic TCP/IP server that will route requests for us...
*/
const IPC = {
    PORT: 9118,
    // IPADDRESS: '127.0.0.1',
    IPADDRESS: '0.0.0.0',
    Start: function () {

        var http = require('http');
        var server = http.createServer(function (requset, response) {
            IPC.ServiceWeb(requset, response);
        });
        //Lets start our server
        server.listen(IPC.PORT, IPC.IPADDRESS, function () {
            console.log("Public Server : [" + IPC.IPADDRESS + ":" + IPC.PORT + "] ");
            console.log("Debug Server: http://127.0.0.1:" + IPC.PORT);

        });


    },

    /*
        This is what you get from the browser....
    */
    ServeDebugAPP(request, response) {

        // Special error sending because its HTML not JSON!!
        function SendError(PageThatFailed) {
            response.end("Unable to load debug page. " + PageThatFailed + " not found!");
        }

        /*
            No matter what they submit.. if it's a GET then they are using a 
            browser. It's not smart to use GET because of the limitations of 
            query string values.  :-)
        */
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        /*
            Sure we are nesting calls.. maybe it looks ugly but its not blocking
            the main thread which we need to service the api requests other users
            make on the server...
        */
        fs.readFile(__dirname + "/debug/debug.html", "utf8", function (err, debugHTML) {
            if (err) {
                SendError('debug.html');

            } else {

                fs.readFile(__dirname + "/debug/client.js", "utf8", function (err, clientjs) {
                    if (err) {
                        SendError('client.js');

                    } else {

                        fs.readFile(__dirname + "/debug/API_HELP.json", "utf8", function (err, API_HELP) {
                            if (err) {
                                SendError('API_HELP.json');

                            } else {
                                fs.readFile(__dirname + "/debug/debug.css", "utf8", function (err, debugCSS) {
                                    if (err) {
                                        SendError('debug.css');

                                    } else {
                                        //


                                        const ServerTimeNow = Date();


                                        //  *** SEND THE END RESPONSE!!!!
                                        const debugdata = `
window.debugdata = {
    port:${IPC.PORT},
    apidata:${API_HELP},
    ST:${ServerTimeNow.toLocaleString()}
};
`+ clientjs;

                                        //Our debug HTML is a great way to make sure our stuff works. :-)
                                        debugHTML = debugHTML.replace('//SERVER-SIDE-REPLACE!!!', debugdata);
                                        debugHTML = debugHTML.replace('/* SERVER REPLACES STYLES */', debugCSS);

                                        response.end(debugHTML);
                                        //  *** SEND THE END RESPONSE!!!!



                                    }
                                });




                            }
                        });//End API_HELP data...
                    }

                });//End Clientside javascript...
            }
        });//end debug html....

    },


    /*
        Generic error information that any service can call to for dumping
        the data back to the cient as json...
    */
    SendError(ResponseObject, ErrorInformation) {
        // debugger;
        if (typeof (ErrorInformation) == "string") {
            ResponseObject.end(ErrorInformation);
        } else {
            ResponseObject.end(JSON.stringify(ErrorInformation));
        }

    },
    /*
        This is the actual method called when a request comes from the server.        
    */
    ServiceWeb: function (request, response) {


        //ignore this request. We are not a real web server!
        if (request.url == "/favicon.ico") {
            response.end();
            return;
        }

        //Give the response and easy way out for errors...
        response.SendError = IPC.SendError;



        //This should always be local host since it's proxy from NGINX...
        request.HostOrigin = request.headers["origin"];
        request.Host = request.headers["host"];

        /*
        //This happens for local debug but we don't need it now that we don't care about urls...
        request.url = request.url.replace('/api/', '');
        request.url = request.url.replace('/api', '');
 
        request.url = request.url.replace('api/', '');
        */

        //default to null!
        request.User = {
            IPAddress: request.headers["x-real-ip"],
            RemoteIP: request.connection.remoteAddress,
            ClientAgent: request.headers["user-agent"],
            URL: request.url
        };


        // Use this only when you need to!!!
        // console.log('Serving User:',request.User);


        // How did they try to get to the server?
        switch (request.method.toUpperCase()) {
            case "POST":
            case "PUT":
                try {

                    var body = '';
                    request.on('data', function (data) {
                        body += data;
                        // Too much POST data, kill the connection!
                        if (body.length > 1e6) response.connection.destroy();
                    });


                    request.on('end', function () {
                        if (body == '') {
                            response.end();
                        }
                        else {
                            request.RequestData = {};

                            //We alwasy use JSON for post!!!
                            response.writeHead(200, {
                                'Content-Type': 'application/json'
                            });

                            try {
                                const url = require('url');
                                const path = require('path');

                                request.RequestData = JSON.parse(body);

                                // debugger;
                                if (!request.RequestData.service) {
                                    response.end(JSON.stringify({
                                        err: 'No service defined!'
                                    }));
                                    return;
                                }
                                //Do not allow ".." in the path!!!!
                                const servicePath = request.RequestData.service.replace(/\./g, '');



                                // var servicePath = request.url.replace(/\./g, '');


                                const finalServicePath = path.resolve(path.join(__dirname, "services", path.normalize(path.join(servicePath, 'index.js'))));

                                const route2Take = require(finalServicePath);
                                route2Take.ServiceRequest(request, response);
                            }
                            catch (errEndReq) {
                                var resp = {
                                    error: 'Error in request!',
                                    //  body: body
                                };
                                console.log("REQUEST ERROR!");
                                console.log("URL", request.url);
                                console.log(errEndReq.message);
                                console.log(body);
                                // debugger;
                                response.end(JSON.stringify(resp));
                            }
                        }
                    });
                }
                catch (errPUT) {

















                    response.SendError(response, {
                        err: errPUT
                    });

                }


                break
            case "GET":
                //Any get request they make will be from a browser so just give them the debug page...
                IPC.ServeDebugAPP(request, response);

                break;
            default:
                // debugger;
                console.log(request.method.toUpperCase() + ' Method Not Supported! .. YET... ');
                response.end(request.method.toUpperCase() + ' Method Not Supported! .. YET... ');
                break;

        }
    }
};



// Async step by step becaues it's easier to debug... They say.. :-)
(async () => {

    try {
        const DATA_FOLDER = require("../LIB/DATA_FOLDER");

        /*
            Open our Mysql server...
        */
        const ConfigFileText = fs.readFileSync(DATA_FOLDER.CONFIG_INFO.SecretFolder + "mysql.json", "utf8");
        const ConfigFileData = JSON.parse(ConfigFileText);
        const PoolReq = await SERVER.SqlData.OpenPoolSync(ConfigFileData);


        //Lets get this party started. :-)
        IPC.Start();



    } catch (errorNoSQLServer) {
        console.log('Critical Error!');
        console.log(errorNoSQLServer);
        process.exit(2);
    }

})();