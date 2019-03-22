 
# NGINX
This is the file server used.


## Linux
On the main server insatll it this way.

    apt-get install nginx



## Mac
Install on Mac for local development.

    brew install nginx

To run it use this.

    sudo nginx



Use this make changes to NGINX. 
 
    sudo nginx 
    sudo nginx -s stop
    sudo nginx -s reload

All active web site configs are found in `/usr/local/etc/nginx/nginx.conf` on the web server.

## User Permissions
 