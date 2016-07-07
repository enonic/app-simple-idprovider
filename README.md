# Simple ID Provider App for Enonic XP

[![Build Status](https://travis-ci.org/enonic/app-simple-idprovider.svg?branch=master)](https://travis-ci.org/enonic/app-simple-idprovider)

This app contains an ID Provider displaying a simple login page on 401 errors.


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