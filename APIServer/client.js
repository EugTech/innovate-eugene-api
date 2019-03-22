/*

*/

const ServerAPI = {

    //Quick and easy way to get data from our api...
    Fetch(APIType, data = {}) {
        const url = document.URL + 'api/' + APIType;
    
        return fetch(url, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit

            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => response.json()); // parses JSON response into native Javascript objects 

    },

    GetHelp(Topic) {
 
        ServerAPI.Fetch(`help`, {
            topic: Topic
        })
            .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
            .catch(error => console.error(error));
 
    }

};

console.info('The API Client has loaded...');
console.info('Feel free to explore this object in the console.', ServerAPI);