# Visual Studio Code
You don't have to use it, but if you do then here are some 
helpful tips to get the most of of this project.


# Debugging
Check out this example of the debug config file.

    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "DEBUG TEST",
                "program": "${workspaceFolder}/test.js"
            },
            {
                "type": "node",
                "request": "launch",
                "name": "DEBUG SaveAllData",
                "program": "${workspaceFolder}/Tools/SaveAllData.js"
            }
        ]
    }