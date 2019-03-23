#!/usr/bin/env node

"use strict";


/*
    Sync data to MySQL server...
*/


var fs = require("fs");
const DATA_FOLDER = require("../LIB/DATA_FOLDER");

global.SERVER = {
    RootFolder: __dirname,
    Arguments: []
};
SERVER.SqlData = require('../LIB/MySQLData');



const ObjectMapData = {};

const sqlTableName_assets = "`asset-inventory`.assets";



// Async step by step becaues it's easier to debug... They say.. :-)
(async () => {

    const ObjectMapAPI = {

        /*
            Save the data to a file using our DATA_FOLDER....
        */
        UpdateAssests(AssetsData) {
            const Result = {
                Updated: 0
            };

         
            return new Promise(resolve => {

                //Take our time and do each record one by one...
                (async () => {
   
                    for (let index = 0; index < AssetsData.length; index++) {
                        
                        const asset = AssetsData[index];
                        
                        //The length of the data is not always the same as whats been updated. Errors in the SQL will skip the row...
                        Result.Updated++;
                 
                        const sql = `
                        INSERT INTO ${sqlTableName_assets}
                        (AName,AssetTypeID,City,Zip,Unit,Notes)
                        VALUES
                        (
                            ${SERVER.SqlData.StripQuotesForString(asset.Name)},
                            5,
                            ${SERVER.SqlData.StripQuotesForString(asset.City)},
                            ${SERVER.SqlData.StripQuotesForString(asset.Zip)}, 
                            ${SERVER.SqlData.StripQuotesForString(asset.Unit)},
                            ${SERVER.SqlData.StripQuotesForString(asset.Notes)}                        
                        );`;



                        const reqs = await SERVER.SqlData.ExecuteSQLSync(sql);

                        if (reqs.err) {
                            console.log(reqs.err);
                        } else {
                            if(reqs.rows.affectedRows<1){
                                console.log('Check the sql!\r\n',sql);
                            }else{
                                console.log("Adding " + asset.Name + " ...");
                            }
                        }

                    }
                    resolve(Result);

                })();

            });


        }
    };



    try {

        //Grab our master map created by the other scripts...
        const MASTER_MAP_DATA = DATA_FOLDER.Disk.GetData('MasterMap');


        /*
            Open our Mysql server...
        */
        const ConfigFileText = fs.readFileSync(DATA_FOLDER.CONFIG_INFO.SecretFolder + "mysql.json", "utf8");
        const ConfigFileData = JSON.parse(ConfigFileText);
        const PoolReq = await SERVER.SqlData.OpenPoolSync(ConfigFileData);

        if (PoolReq.err) {
            console.log('Unable to use the MySQL server.');
            process.exit(1);
        }

        console.log(" --------------------------------------------- ");
        console.log("Removing old records since we don't have a unique key from airtable.  :-( ");

        const sql = "TRUNCATE " + sqlTableName_assets + " ;";
        const reqs = await SERVER.SqlData.ExecuteSQLSync(sql);


        console.log(" --------------------------------------------- ");

        const MapASSEETS = await ObjectMapAPI.UpdateAssests(MASTER_MAP_DATA.Assets);

        console.log("Looks like we are done! Total Records:" + MapASSEETS.Updated);
        process.exit(0);


    } catch (errConnectDatabase) {
        console.log(errConnectDatabase);
    }

})();
