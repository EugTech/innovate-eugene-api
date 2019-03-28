# innovate-eugene-api

To get live help and debug information visit https://api.innovateeugene.com/api or 
https://api.innovateeugene.com/ for more information.


 
- [Important](#important) 
- [Installing](Notes/installing.md) 
- [Notes](Notes)
- [Tools](Tools) 
- [Helpful Links](Notes/links.md)




Please see the [asset-inventory](https://github.com/EugTech/asset-inventory) 
project for why this project is needed.

An important note is the short list of vendor modules and libraries. It's easy 
to do slap on another NPM but before you do, [create an issue on github](https://github.com/EugTech/innovate-eugene-api/issues)
and give the leadership a chance to approve the changes. Otherwise, lets keep 
this project as clean and close to the metal as possible. 



# Clone The Project
Make sure you setup your SSH correctly!

    git clone git@github.com:EugTech/innovate-eugene-api.git




# Important
Make sure you create a `DATA` and `SECRET` folder before you try to 
run any scripts. 

    mkdir DATA
    cd DATA
    mkdir SECRET


** READ THE [README's](Notes)!  :-)




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

Get and ID and PASSWORD from a system admin. Open an issue on github if need be. 



## TODO
This is quick running to do list of items that should be moved to the github issues list.

- [x] Update Issues!
- [%] Document API
- [?] Build SQL tables 
- [%] Sync Airtable data  


# Testing the API

Checkout [API Tester](https://www.apitester.com/) and use the 
enpoint `https://api.innovateeugene.com/api` and the 
request body of `{"service":"data","view":"AllAssets"}` .

There are many API testers out there. It's all REST so just pick your favorite 
testing tool and go with it. 

