#!/usr/bin/env node

"use strict";




/*
    Write out the excel file.
*/


const XLSXmanager = require("../LIB/XLSX").ExcelManager;

const ExportFileName = "FullDataExport.xlsx";


XLSXmanager.WriteFile({
    /* output format determined by filename */
    FileName: ExportFileName
}, function (err, FileData) {
    if (err) {
        console.log(err);
        debugger;
    } else {
        console.log('Finshed writting to the file "' + ExportFileName + '"');
    }
});