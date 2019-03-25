 
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

All active web site configs are found in `/usr/local/etc/nginx/nginx.conf` on the web server.

## Setting User Permissions
The `SECRET` folder must have permissions set so that other users
can't see it.

    sudo chmod 0750 DATA/SECRET

## Updating NGINX
Use this after you make changes to NGINX config files. 
 
    sudo nginx -t
    sudo nginx -s stop
    sudo nginx -s reload

The best way to make sure your changes are set is to do this...

    sudo service nginx restart

