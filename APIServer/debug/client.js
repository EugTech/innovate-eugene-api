/*
    Simple wrapper to test the API...
*/


const ServerAPI = {


    //Quick and easy way to get data from our api...
    Fetch(data = {}) {
        const url = document.URL + 'api/';

        return fetch(url, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit

            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        }).then(response => response.json()); // parses JSON response into native Javascript objects 

    },

    GetHelp(Topic) {

        ServerAPI.Fetch({
            service: 'help',
            data: {
                topic: Topic
            }
        })
            .then(data => {
                console.log('This is the help data...', data);
            }) // JSON-string from `response.json()` call
            .catch(error => {
                console.error(error);
                debugger;
            });

    },

    GetDataFolder(Topic) {

        ServerAPI.Fetch({
            service: 'dbfolder',
            data: {
                file: 'MasterMap'
            }
        })
            .then(data => {
                console.log('This is the assets data...', data);
            }) // JSON-string from `response.json()` call
            .catch(error => {
                console.error(error);
                debugger;
            });

    },
    GetData(OptionsConfig) {
        if (!OptionsConfig) {
            //Put in a default if they are just playing around...
            OptionsConfig = {
                data: {
                    view: 'test'
                }
            };
        }
        OptionsConfig.service = "data";

        ServerAPI.Fetch(OptionsConfig)
            .then(data => {
                if (OptionsConfig.OnData) {
                    OptionsConfig.OnData(null, data);
                }
                // console.log('MySQL Data:', data);
            }) // JSON-string from `response.json()` call
            .catch(error => {
                // console.error(error);
                debugger;
                if (OptionsConfig.OnData) {
                    OptionsConfig.OnData(error, null);
                }
            });

    },
    TEST: {
        GetAllAssets() {
            ServerAPI.GetData({
                view: 'AllAssets',
                OnData: function (err, AllData) {
                    if (err) {
                        console.warn('Error in API!', err);
                    } else {
                        console.log('All Assets via SQL!');
                        console.log(AllData);
                    }

                }
            });
        },
        GetDBStats() {
            ServerAPI.GetData({
                view: 'TableTotals',
                OnData: function (err, AllData) {
                    if (err) {
                        console.warn('Error in API!', err);
                    } else {
                        console.log('Database stats...!');
                        console.log(AllData);
                    }

                }
            });
        }

    }

};

const DebugUI = {

    SetHelpTable() {
        DebugUI.DisplayTestingActions = document.getElementById("DisplayTestingActions");
        DebugUI.DisplayTestingResults = document.getElementById("DisplayTestingResults");
        DebugUI.DisplayTestingHelp = document.getElementById("DisplayTestingHelp");


        DebugUI.DisplayTestingResults.innerHTML = "Ready to display testing results!"
        DebugUI.DisplayTestingHelp.innerHTML = "Ready to display dynamic api help..."


        //Clear any old stuff...
        DebugUI.DisplayTestingActions.innerHTML = "";

        // debugger;

        for (var n in debugdata.apidata) {
            const namespace = debugdata.apidata[n];
            AddTestingRow(n, namespace);
        }


        function AddTestingRow(NameSpace, RowData) {



            //for each test record we have....
            for (var t in RowData.test) {
                const test = RowData.test[t];

                // console.log(test);

                const TestActionRow = document.createElement('tr');
                TestActionRow.title = "NameSpace:" + NameSpace;

                const TestActionColA = document.createElement('td');
                const TestActionColB = document.createElement('td');

                TestActionColA.innerHTML = test.text;
                TestActionColB.innerHTML = test.title;

                TestActionColA.className = "buttonclick";

                //Let children reference the test record....
                TestActionRow.DataRecord = test;

                //Set DOM links for easy scripting access....
                TestActionColA.RowElement = TestActionRow;
                TestActionColB.RowElement = TestActionRow;


                //User clicked on me!!!! ??
                TestActionColA.onclick = function () {
                    // console.log(this.RowElement);
                    // debugger;
                    console.log(this.RowElement.DataRecord);
                    try {
                        window.eval(this.RowElement.DataRecord.cmd);
                    } catch (errEval) {
                        console.warn('Bad Eval!', errEval);
                        debugger;

                    }
                }

                TestActionRow.appendChild(TestActionColA);
                TestActionRow.appendChild(TestActionColB);
                DebugUI.DisplayTestingActions.appendChild(TestActionRow);


            }



            // const rowHTML = `            
            //     <td>
            //     <b>${NameSpace}</b>
            //     </td>
            //     <td>${RowData.notes}</td>            
            // `;
            // const TR = document.createElement('tr');
            // TR.innerHTML = rowHTML;
            // DebugUI.DisplayTestingActions.appendChild(TR);

        }


    },
    //Show the server info via HTML in a componet fashion....
    SetSysInfo() {
        const SystemInfo = document.getElementById("SystemInfo");

        //Setup a simple function to add html to our DOM... super simple!!!!!!!!!
        function AddInfoElement(InfoText, InfoTip, ElementData) {
            const NewEL = document.createElement('div');
            NewEL.innerHTML = '<b>' + InfoText + '</b> : ' + ElementData;
            NewEL.title = InfoTip;
            NewEL.className = "FooterSysInfo";
            SystemInfo.appendChild(NewEL);
        }

        AddInfoElement('Server Birth', 'The date the server started', debugdata.ST.toLocaleDateString() + " " + debugdata.ST.toLocaleTimeString());
        AddInfoElement('Port', 'APIServer TCP/IP Port', debugdata.port);
        AddInfoElement('Host', 'The hostname of this server',
            '' + window.location.hostname + '');

    }
};

//After page has loaded...
window.onload = function () {



    console.info('The API Client has loaded...');
    console.info('Feel free to explore this object in the console.');
    /*
        This is only available to the debug client. We 
        don't put this in normal requests from users... 
    */
    console.info(`
    
        Use : "ServerAPI" for easy code to help with testing.
        Use : "debugdata" in the console for the api data help.
    
    `);

    DebugUI.SetHelpTable();
    DebugUI.SetSysInfo();

};
