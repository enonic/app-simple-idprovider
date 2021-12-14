# Simple ID Provider App for Enonic XP

[![Build Status](https://travis-ci.org/enonic/app-simple-idprovider.svg?branch=master)](https://travis-ci.org/enonic/app-simple-idprovider)
[![License](https://img.shields.io/github/license/enonic/app-simple-idprovider.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

This ID Provider contains a simple login/logout page to authenticate your local users.
(Optional) Provides a password reset mechanism. 
(Optional) Retrieves and displays the Gravatar picture of a logged in user.

## Usage

### Step 1: Install the application
1. In the admin tool "Applications" of your Enonic XP installation, click on "Install". 
2. Select the tab "Enonic Market", find "Simple ID Provider", and click on the link "Install".

### Step 2: Create and configure the user store
1. In the admin tool "Users", click on "New".
2. Fill in the fields and, for the field "ID Provider", select the application "Simple ID Provider".
3. Configure the ID Provider:
    * Title: Title used by the login/logout page
    * Theme: Display theme of the login/logout page
    * Gravatar picture: If enabled, the Gravatar picture of the logged in user will be displayed on the logout page
    * (Optional) Session timeout: Session timeout (in seconds). By default, the value of session.timeout from com.enonic.xp.web.jetty.cfg
    * (Optional) Forgot password: If set, the login page will propose a password reset mechanism. 
You need to have set up the mail configuration 
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
    mapping.admin.userStore = system
    
    mapping.mysite.host = localhost
    mapping.mysite.source = /
    mapping.mysite.target = /portal/master/mysite
    mapping.mysite.userStore = myuserstore
    ```


## Releases and Compatibility

| App version | Required XP version | Download |
|-------------|--------------------| -------- |
| 1.2.3       | 6.15.13            | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.2.3/simpleidprovider-1.2.3.jar) |
| 1.2.2       | 6.13.0             | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.2.2/simpleidprovider-1.2.2.jar) |
| 1.2.1       | 6.13.0             | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.2.1/simpleidprovider-1.2.1.jar) |
| 1.2.0       | 6.13.0             | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.2.0/simpleidprovider-1.2.0.jar) |
| 1.1.3       | 6.7.0              | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.1.3/simpleidprovider-1.1.3.jar) |
| 1.1.2       | 6.7.0              | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.1.2/simpleidprovider-1.1.2.jar) |
| 1.1.1       | 6.7.0              | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.1.1/simpleidprovider-1.1.1.jar) |
| 1.1.0       | 6.7.0              | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.1.0/simpleidprovider-1.1.0.jar) |
| 1.0.0       | 6.6.0              | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.0.0/simpleidprovider-1.0.0.jar) |


## Building and deploying

Build this application from the command line. Go to the root of the project and enter:

    ./gradlew clean build

To deploy the app, set `$XP_HOME` environment variable and enter:

    ./gradlew deploy


## Releasing new version

To release a new version of this app, please follow the steps below:

1. Update `version` (and possibly `xpVersion`) in  `gradle.properties`.

2. Compile and deploy to our Maven repository:

    ./gradlew clean build uploadArchives

3. Update `README.md` file with new version information and compatibility.

4. Tag the source code using `git tag` command (where `X.Y.Z` is the released version):

    git tag vX.Y.Z

5. Push the updated code to GitHub.

    git push origin vX.Y.Z
