#!/usr/bin/env node

"use strict";



/*
    Save all the data from the airtable space. If you use linux or Mac then
    you can launch it from the command line like so...

        ./SaveTallData.js

    otherwise use node...
    
        node SaveTallData.js

*/



var AirTable = require("../LIB/AirTable.js");

/*
    Lets use the disk and not the API! This is very helpful 
    when debugging because of rate limits on the API itself...
*/
AirTable.CONFIG.UseDisk = false;


//Set our base ID...
var AirTableBase = AirTable.AirtableBase('appiPhOBADo9NMICo');

/*
    Which sheets do we want to deal with?
    Get this list from airtable.com!
*/
const SheetNames = ['Assets', 'Asset Types', 'Entity Types', 'Study Tags'];
 




/*
    Do async so it's step by step and easy to debug. This it not intended
    to be a service so we can take all the time we need...
*/
(async () => {

    const TotalSheets = SheetNames.length;

    for (let index = 0; index < TotalSheets; index++) {

        //Get a ref to each sheet...
        const SheetName = SheetNames[index];

        console.log('Saving Sheet: ' + SheetName);


        var res = await AirTable.GetGridViewDataSync(SheetName, AirTableBase);
        if (res.err) {
            console.log(res.err);
            process.exit(1);
        } else {
            console.log('Data Saved to [' + SheetName.replace(/ /g, '') + '] with ' + SheetName.length + ' items.');
        }


    }

    console.log('I have finished saving all the files...');
})();








