/*
    Wrap up the common features of the API to make our code 
    simple and easy to use. 
*/
var fs = require("fs");
var path = require("path");

const DATA_FOLDER = require("./DATA_FOLDER");




// const SecretFolder = path.join(__dirname, '../SECRET/');

// /*
//     Create the folders we need if the user didn't do it on their own. This happens
//     when they don't actually read the README. :-)
// */

// if (!fs.existsSync(SecretFolder)) {
//     fs.mkdirSync(SecretFolder);
// }






/*
    This is your opertunity to set configuration settings 
    for the entire module. Shortcuts are awesome!  :-)
*/
const CONFIG = {
    //What is the version of this file?
    Version: "1.0.0.0",

    //Use online API or quick disk access?
    UseDisk: true,

    /* 
        Change this to make it faster, but check out 
        https://airtable.com/appiPhOBADo9NMICo/api/docs#nodejs/ratelimits 
        before you do so...
    */
    TimeBufferInSeconds: 1
};
exports.CONFIG = CONFIG;







/*
    Simple wrapper to get the data from airtable 
    as JSON...
*/
function GetGridViewData(sheetName, AirTableBase, OnData) {

    //Our data map to add items to...
    const ViewData = [];


    if (CONFIG.UseDisk) {
        const data = DATA_FOLDER.Disk.GetData(sheetName);
        OnData(null, data);
    } else {

        AirTableBase(sheetName).select({
            // Selecting the first 3 records in Main View:
            maxRecords: 300,
            view: "Grid view"
            // This function (`page`) will get called for each page of records.
        }).eachPage(function page(records, fetchNextPage) {

            records.forEach(function (record) {
                ViewData.push(record.fields);
            });

            /*
                Fetch next records based on time that is set via the 
                config "TimeBufferInSeconds"..
            */
            setTimeout(() => {
                fetchNextPage();
                /*
                    Remember that airtable.com has a rate limit on thier api. It's by time so use time 
                    to make sure you don't request too much too soon. 
                */                
            }, CONFIG.TimeBufferInSeconds * 1000);

        }, function done(err) {
            if (err) {
                OnData(err, null);
            } else {
                /*
                    If we are not using the disk, store the data for 
                    later use.
                */
                if (!CONFIG.UseDisk) {
                    DATA_FOLDER.Disk.SaveData(sheetName, ViewData);
                }
                OnData(null, ViewData);
            }
        });
    }

}
exports.GetGridViewData = GetGridViewData;


/*
    To use ASYNC we just wrap up our normal code
    in a promise...
*/
function GetGridViewDataSync(sheetName, AirTableBase) {
    return new Promise(resolve => {

        GetGridViewData(sheetName, AirTableBase, function (err, PromiseInfo) {
            if (err) {
                resolve({
                    err: err
                });
            } else {
                resolve({
                    data: PromiseInfo
                });
            }
        });

    });
}
exports.GetGridViewDataSync=GetGridViewDataSync;

/*
    Get our API key and use that to build a reference to
    the airtable API object...
*/
exports.AirtableBase = function (TableID) {

    try {
        
        const APIKEY = fs.readFileSync(DATA_FOLDER.CONFIG_INFO.SecretFolder + "airtable_apikey.txt", "utf8");


        var Airtable = require('airtable');
        var base = new Airtable({ "apiKey": APIKEY }).base(TableID);

    } catch (errNoAPIKeyFile) {
        console.log('Create a file "' + DATA_FOLDER.CONFIG_INFO.SecretFolder + 'airtable_apikey.txt"');
        process.exit(1);
    }
    return base;
}