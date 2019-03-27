# asset-inventory-openair

The home of our project is http://api.innovateeugene.com/

 
- [Important](#important) 
- [Installing](Notes/installing.md) 
- [Notes](Notes)
- [Tools](Tools) 
- [Helpful Links](Notes/links.md)




Please see the [asset-inventory](https://github.com/EugTech/asset-inventory) project for why this project is needed.



This is still a work in progress. Time line is Monday March 18th.



# Important

Make sure you create a `DATA` and `SECRET` folder before you try to 
run any scripts. 

    mkdir DATA
    cd DATA
    mkdir SECRET

 

** READ THE [README's](Notes)!  :-)


Debuging...
http://0.0.0.0:9118/



# MySQL 
Make sure you have a file called `mysql.json` in the `DATA/SECRET` folder!
Example:

    {
        "host": "127.0.0.1",
        "port": 3306,
        "user": "mydbuser",
        "password": "mypassword",
        "database": "asset-inventory"    
    }





## TODO
This is quick running to do list of items that should be moved to the github issues list.

- [x] Created project and have tested and provable code.
- [x] Support other spreadsheet type services.
- [x] Move code to Eugene Tech github.
- [x] Get server hosting? 
- [ ] Connect github repo for the client UI. 
- [ ] Build SQL tables for the airtable data.