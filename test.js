/*
    Put your testing stuff here. :-)
*/




/*
    Put all your test cases here. Make it easy to switch back 
    and forth...
*/
const TestMap = {
    GetSingleViewData() {

        var AirTable = require("./LIB/AirTable.js");

        /*
            Lets use the disk and not the API! This is very helpful 
            when debugging because of rate limits on the API itself...
        */
        AirTable.CONFIG.UseDisk = true;


        //Set our base ID...
        var AirTableBase = AirTable.AirtableBase('appiPhOBADo9NMICo');

        //Which sheet anme or view do we want to deal with?
        const ViewName = "Assets";




        //Use our wrapper to get the data...
        AirTable.GetGridViewData(ViewName, AirTableBase, function (ErrorObj, GridData) {

            if (ErrorObj) {
                console.log('error');
                console.log(ErrorObj);
                debugger;
                process.exit(1);
            } else {
                for (let index = 0; index < GridData.length; index++) {
                    const element = GridData[index];
                    console.log(element);
                }
                console.log('Finished Testing!');

            }
        });

    },
    GetSingleViewDataSync() {

        (async () => {






            var AirTable = require("./LIB/AirTable.js");

            /*
                Lets use the disk and not the API! This is very helpful 
                when debugging because of rate limits on the API itself...
            */
            AirTable.CONFIG.UseDisk = true;


            //Set our base ID...
            var AirTableBase = AirTable.AirtableBase('appiPhOBADo9NMICo');

            //Which sheet anme or view do we want to deal with?
            const ViewName = "Assets";

            var res = await AirTable.GetGridViewDataSync(ViewName, AirTableBase);
            console.log(res);


        })();


    }
};

 

//Which test case do you want to do?
 
// TestMap.GetSingleViewData();
TestMap.GetSingleViewDataSync();
