#!/usr/bin/env node

"use strict";


/*
    Build a true object map of the data.
*/


const DATA_FOLDER = require("../LIB/DATA_FOLDER");

//The master map of all data...
const ObjectMapData = {};

//Code to manage the map data..
const ObjectMapAPI = {
    LoadLookupDataFile(SheetName) {
        try {
            ObjectMapData[SheetName] = DATA_FOLDER.Disk.GetData(SheetName);
            console.log('Loaded ' + SheetName + '.json file.')

        } catch (errLoading) {
            console.log(" ********************************************* ");
            console.log(errLoading);
            console.log(" ********************************************* ");
            process.exit(1);
        }

    },
    FindStudyTag(LinkID) {
        const astData = ObjectMapData['AssetTypes'];
        const returnArray = [];
        for (var a in astData) {
            const rec = astData[a];
            const st = rec["Study Tags"];

            for (let index = 0; index < st.length; index++) {

                const element = st[index];

                //Hey look a match! Add it to our return array....
                if (element == LinkID) {
                    returnArray.push(rec.Name);
                }
            }

        }

        return returnArray;

    },
    FindEntityType(LinkID) {
        const astData = ObjectMapData['EntityTypes'];
        const returnArray = [];
        for (var a in astData) {
            const rec = astData[a];
            const st = rec["Field 5"]; //This name????

            for (let index = 0; index < st.length; index++) {

                const element = st[index];

                //Hey look a match! Add it to our return array....
                if (element == LinkID) {
                    returnArray.push(rec.Name);
                }
            }

        }

        return returnArray;

    },
    /*
        Save the data to a file using our DATA_FOLDER....
    */
    SaveData() {
        DATA_FOLDER.Disk.SaveData('MasterMap', ObjectMapData);
        console.log('The "MasterMap.json" has been written!');
    },

    /*
        Loop through each row and fix stuff...
    */
    // ******************************************************
    FixAssestsData() {
        const AssetsData = ObjectMapData['Assets'];

        //Just test first row...
        // const testrow = AssetsData[0];
        // FixRow(testrow);
        //return;

        FixRows();

        //Go through all the rows!
        function FixRows() {
            for (let index = 0; index < AssetsData.length; index++) {
                const row = AssetsData[index];
                FixRow(row);
            }
        }

        //fix a single row...
        function FixRow(RowOfData) {
            for (var f in RowOfData) {

                const field = RowOfData[f];

                const value2Lookup = field[0];

                //Lookups are of type object....
                if (typeof (field) == "object") {

                    // const fldName = f.replace(/ /g, '');

                    //Lets do special study tags...
                    if (f == "Study Tags") {

                        const foundRecord = ObjectMapAPI.FindStudyTag(value2Lookup);

                        if (!foundRecord) {
                            console.log('Record Key Not Found: ' + value2Lookup);

                        } else {
                            // Reset object with new lookup!
                            RowOfData[f] = foundRecord;

                        }
                    }//End if Study Tag...                
                }//End  if field is an object....
            }// End for loop...
        }
    },

    FixAssestTypesData() {
        const AssetTypessData = ObjectMapData['AssetTypes'];

        //Just test first row...
        const testrow = AssetTypessData[0];
        FixRow(testrow);
        return;

        FixRows();

        //Go through all the rows!
        function FixRows() {
            for (let index = 0; index < AssetTypessData.length; index++) {
                const row = AssetTypessData[index];
                FixRow(row);
            }
        }

        //fix a single row...
        function FixRow(RowOfData) {
            for (var f in RowOfData) {

                const field = RowOfData[f];

                const value2Lookup = field[0];

                //Lookups are of type object....
                if (typeof (field) == "object") {

                    // const fldName = f.replace(/ /g, '');

                    //Lets do special study tags...
                    if (f == "Study Tags") {

                        const foundRecord = ObjectMapAPI.FindStudyTag(value2Lookup);

                        if (!foundRecord) {
                            console.log('Record Key Not Found: ' + value2Lookup);

                        } else {
                            // Reset object with new lookup!
                            RowOfData[f] = foundRecord;

                        }
                    }//End if Study Tag...                
                }//End  if field is an object....
            }// End for loop...
        }
    },

    FixEntityTypesData() {
        const EntityData = ObjectMapData['EntityTypes'];

        //Just test first row...
        // const testrow = EntityData[0];
        // FixRow(testrow);
        // return;


        FixRows();

        //Go through all the rows!
        function FixRows() {
            for (let index = 0; index < EntityData.length; index++) {
                const row = EntityData[index];
                FixRow(row);
            }
        }

        //fix a single row...
        function FixRow(RowOfData) {
            for (var f in RowOfData) {

                const field = RowOfData[f];

                const value2Lookup = field[0];

                //Lookups are of type object....
                if (typeof (field) == "object") {

                    // const fldName = f.replace(/ /g, '');

                    //Yikes what is thes???? 
                    if (f == "Field 5") {

                        const foundRecord = ObjectMapAPI.FindEntityType(value2Lookup);

                        if (!foundRecord) {
                            console.log('Record Key Not Found: ' + value2Lookup);

                        } else {
                            // Reset object with new lookup!
                            RowOfData[f] = foundRecord;
                        }
                    }//End if Study Tag...                
                }//End  if field is an object....
            }// End for loop...
        }
    },
    // ******************************************************
};



console.log(' ****************************************************** ');
console.log('This is still in development! Most of it is broke!');
console.log(' ****************************************************** ');


//Load up all of our lookup files and keep it in memory...
ObjectMapAPI.LoadLookupDataFile('Assets');
ObjectMapAPI.LoadLookupDataFile('AssetTypes');
ObjectMapAPI.LoadLookupDataFile('EntityTypes');
ObjectMapAPI.LoadLookupDataFile('StudyTags');


// We know of at least this one that needs to be fixed...
// ObjectMapAPI.FixAssestsData();
ObjectMapAPI.FixAssestTypesData();
// ObjectMapAPI.FixEntityTypesData();


//No longer needed!!!!
delete ObjectMapData['StudyTags'];

// const testData = ObjectMapData['AssetTypes'];

// console.log(ObjectMapData);
// console.log(testData);



ObjectMapAPI.SaveData();


