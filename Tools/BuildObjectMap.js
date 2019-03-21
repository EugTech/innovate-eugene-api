#!/usr/bin/env node

"use strict";


/*
    Build a true object map of the data.
*/


const DATA_FOLDER = require("../LIB/DATA_FOLDER");


const ObjectMapData = {};

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
    /*
        Save the data to a file using our DATA_FOLDER....
    */
    SaveData() {
        DATA_FOLDER.Disk.SaveData('MasterMap', ObjectMapData);
        console.log('The "MasterMap.json" has been written!');
    }
};





//Load up all of our lookup files and keep it in memory...
ObjectMapAPI.LoadLookupDataFile('Assets');
ObjectMapAPI.LoadLookupDataFile('AssetTypes');
ObjectMapAPI.LoadLookupDataFile('EntityTypes');
ObjectMapAPI.LoadLookupDataFile('StudyTags');

/*
    Loop through each row and fix it...
*/
function FixAssestsData(SheetData) {

    const AssetsData = ObjectMapData['Assets'];
    
    //Just test first row...
    const testrow = AssetsData[0];
    

    FixRow(testrow);
    return;

    //Go through all the rows!
    function FixRows(){
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
                        RowOfData['Study Tags'] = foundRecord;

                    }
                }//End if Study Tag...                
            }//End  if field is an object....
        }// End for loop...
    }

}


// We know of at least this one that needs to be fixed...
FixAssestsData();
 

ObjectMapAPI.SaveData();
 

