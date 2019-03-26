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
    ServiceWeb: function (request, response) {


        //ignore this request. We are not a real web server!
        if (request.url == "/favicon.ico") {
            response.end();
            return;
        }



        //This should always be local host since it's proxy from NGINX...
        request.HostOrigin = request.headers["origin"];
        request.Host = request.headers["host"];

        /*
        //This happens for local debug...
        request.url = request.url.replace('/api/', '');
        request.url = request.url.replace('/api', '');

        //This happens on the server...
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
                                if(!request.RequestData.service){
                                    response.end(JSON.stringify({
                                        err:'No service defined!'
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
                    response.end(errPUT.message);
                }


                break
            case "GET":

                /*
                    No matter what they submit.. if it's a GET then they are using a 
                    browser. It's not smart to use GET because of the limitations of 
                    query string values.  :-)
                */
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                //This should most definitly not be sync!!!!
                var debugHTML = fs.readFileSync(__dirname + "/debug.html", "utf8");
                var clientjs = fs.readFileSync(__dirname + "/client.js", "utf8");


                const debugdata = `
                window.debugdata = {
                    port:${IPC.PORT}
                };
                `+ clientjs;

                //Our debug HTML is a great way to make sure our stuff works. :-)
                debugHTML = debugHTML.replace('//SERVER-SIDE-REPLACE!!!', debugdata);

                response.end(debugHTML);
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