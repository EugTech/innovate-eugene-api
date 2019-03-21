# Tools and Utilities
Use these helpful scripts on the server or desktop. 

Add more tools and document them here. :-)


*MAKE SURE YOU HAVE CREATED A `DATA` FOLDER!*

# SaveAllData
Use this tool to save all the records from the airtable space 
into json files in the DATA folder. Each "view" will get their
own file name and json stuffed into it.  

    cd Tools
    ./SaveTallData.js

If you are running Windows then do this....

    cd Tools
    node SaveTallData.js

# WriteExcelFile
Use this tool to create `FullDataExport.xlsx` in the DATA folder
of all the data from the DATA folder. Run this after the *SaveAllData*
to get everything. 

    cd Tools
    ./WriteExcelFile.js

If you are running Windows then do this....

    cd Tools
    node WriteExcelFile.js


# BuildObjectMap
Use this tool to create `MasterMap.json` in the DATA folder.
Run this after the *SaveAllData* to get ever 

    cd Tools
    ./BuildObjectMap.js

If you are running Windows then do this....

    cd Tools
    node BuildObjectMap.js




# Debugging Tools
Visual Studio Code is a great tool to use to debug nodejs but you can 
use whatever debugger you want. Create the runners you need in your 
own tool to get you to a point you can step through and edit as needed.