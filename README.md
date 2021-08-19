# Simple ID Provider App for Enonic XP

[![Actions Status](https://github.com/enonic/app-simple-idprovider/workflows/Gradle%20Build/badge.svg)](https://github.com/enonic/app-simple-idprovider/actions)
[![License](https://img.shields.io/github/license/enonic/app-simple-idprovider.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

This ID Provider contains a simple login/logout page to authenticate your local users.
(Optional) Provides a password reset mechanism. 
(Optional) Retrieves and displays the Gravatar picture of a logged in user.

## Usage

### Step 1: Install the application
1. In the admin tool "Applications" of your Enonic XP installation, click on "Install". 
2. Select the tab "Enonic Market", find "Simple ID Provider", and click on the link "Install".

### Step 2: Configure the ID provider and email authentication
Configure the ID Provider: 
* Title: Title used by the login/logout page
* Theme: Display theme of the login/logout page
* Gravatar picture: If enabled, the Gravatar picture of the logged in user will be displayed on the logout page
* (Optional) Session timeout: Session timeout (in seconds). By default, the value of session.timeout from com.enonic.xp.web.jetty.cfg
* (Optional) Forgot password: If set, the login page will propose a password reset mechanism. 
* (Optional) Two-step authentication: 
    * Email: Sends an email with a login code 

You need to have set up the mail configuration for "Forgot password" and Two-step email authentication. 
(See [Mail Configuration](http://xp.readthedocs.io/en/stable/operations/configuration.html#mail-configuration) for more information).

* Email author: The author of the password reset mail
* Site name: Name used in the password reset mail body
* (Optional) ReCaptcha: Add a reCaptcha field to the forgot password form.

You need to have registered your website on reCaptcha (See [reCaptcha](https://www.google.com/recaptcha/admin) for more information).
            * Site key: Your reCaptcha site key.  
            * Secret key: Your reCaptcha secret key.
            
### Step 3: Create and configure the user store
1. Edit the configuration file "com.enonic.xp.web.vhost.cfg", and set the new user store to your virtual host.
(See [Virtual Host Configuration](http://xp.readthedocs.io/en/stable/operations/configuration.html#configuration-vhost) for more information).

    ```ini
    enabled=true
      
    mapping.admin.host = localhost
    mapping.admin.source = /admin
    mapping.admin.target = /admin
    mapping.admin.idProvider.system = default
    
    mapping.mysite.host = localhost
    mapping.mysite.source = /
    mapping.mysite.target = /portal/master/mysite
    mapping.mysite.idProvider.simpleuserstore = default
    ```


## Releases and Compatibility

| App version | Required XP version |
| ----------- | ------------------- |
| 2.1.0 | 7.3.0 | 
| 2.0.0 | 7.0.0 | 
| 1.2.2 | 6.13.0 |  
| 1.2.1 | 6.13.0 | 
| 1.2.0 | 6.13.0 | 
| 1.1.3 | 6.7.0 | 
| 1.1.2 | 6.7.0 | 
| 1.1.1 | 6.7.0 | 
| 1.1.0 | 6.7.0 | 
| 1.0.0 | 6.6.0 | 


## Building and deploying

Build this application from the command line. Go to the root of the project with the Enonic CLI:

    enonic project build

To deploy the app with the Enonic CLI:

    enonic project deploy


## Releasing new version

To release a new version of this app:

Update the `version` in gradle.properties on the master branch. 
This should trigger a Github action that publishes the app.
