/*
    Wrap up the MS Excel XSLX file format functions..

    See https://github.com/SheetJS/js-xlsx for more information
    on how to use their NPM.
*/

const excelService = require('xlsx');
const DATA_FOLDER = require("./DATA_FOLDER");



/*
    Quick API Wrapper...
*/
const ExcelManager = {
    WriteFile(FileOptions, OnComplete) {



        // debugger;

        try {
            var AllData = DATA_FOLDER.ReadJSONFiles(DATA_FOLDER.CONFIG_INFO.FolderPath);
 
   


            //Build a new workbook...
            const WorkBook = excelService.utils.book_new();
 

            for (var s in AllData) {


                var sheet_data = [];
                 

                const sheetData = AllData[s];
                const sheetName = s;

                //Grab the first record to get our fields list...
                const Fields = sheetData[0];
                const fieldsRow = [];

                for (var f in Fields) {
                    fieldsRow.push(f);
                }
                sheet_data.push(fieldsRow)

                //Go through each row...
                for (let index = 0; index < sheetData.length; index++) {
                    const row = sheetData[index];
                    const colValues = [];
                    for (var c in row) {
                        const column = row[c];

                        if (typeof (column) == "object") {                            
                            //Pick off the first value...
                            colValues.push(column[0]);
                        } else {
                            colValues.push(column);
                        }
                    }
                    sheet_data.push(colValues);
                }


                var ws = excelService.utils.aoa_to_sheet(sheet_data);
                excelService.utils.book_append_sheet(WorkBook, ws, sheetName);
            }




            /* output format determined by filename */ 
            excelService.writeFile(WorkBook, DATA_FOLDER.CONFIG_INFO.FolderPath + '/' + FileOptions.FileName);

            OnComplete(null);




        } catch (errDoSteps) {
            console.log(errDoSteps);
            debugger;
            OnComplete(errDoSteps);

        }
    },



    /*
        Import all the JSON files in our DATA folder
        and stuff it in our Execl file...
    */
    ImportData(ExcelData, OnImport) {


 


 

    }
};


exports.ExcelManager = ExcelManager;