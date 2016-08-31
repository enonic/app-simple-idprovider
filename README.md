# Simple ID Provider App for Enonic XP

[![Build Status](https://travis-ci.org/enonic/app-simple-idprovider.svg?branch=master)](https://travis-ci.org/enonic/app-simple-idprovider)
[![License](https://img.shields.io/github/license/enonic/app-simple-idprovider.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

This ID Provider contains a simple login/logout page to authenticate your local users.
(Optional) Provides a password reset mechanism. 
(Optional) Retrieves and displays the Gravatar picture of a logged in user.

## Usage

### Step 1: Install the application
In the admin tool "Applications" of your Enonic XP installation, click on "Install". 
Select the tab "Enonic Market", find "Simple ID Provider", and click the link "Install".

### Step 2: Create and configure the user store
In the admin tool "Users", click on "New".
Fill in the fields and for the field "ID Provider", select the application "Simple ID Provider".
Configure the ID Provider:
* Title: Title used by the login/logout page
* Theme: Display theme of the login/logout page
* (Optional) Forgot password: If set, the login/logout page will propose a password reset mechanism
 * Email author: The author of the password reset mail
 * Site name: Name used in the password reset mail
 * (Optional) ReCaptcha: Add a reCaptcha field for forgot password form
  * Site key: Your reCaptcha site key.  [Get reCaptcha](https://www.google.com/recaptcha/admin)
  * Secret key: Your reCaptcha secret key. [Get reCaptcha](https://www.google.com/recaptcha/admin)



## Releases and Compatibility

| App version | Required XP version | Download |
| ----------- | ------------------- | -------- |
| 1.0.0 | 6.6.0 | [Download](http://repo.enonic.com/public/com/enonic/app/simpleidprovider/1.0.0/simpleidprovider-1.0.0.jar) |


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