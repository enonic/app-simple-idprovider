# Simple Auth App for Enonic XP

This app contains an ID Provider displaying a simple login page on 401/403 errors.
The ID Provider uses basic access authentication to log the user.


## Releases and Compatibility

| App version | Required XP version | Download |
| ----------- | ------------------- | -------- |
| 1.0.0_SNAPSHOT | 6.6.0 | Not available |


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

4. Tag the source code using `git tag` command (where `X.X.X` is the released version):

    git tag vX.X.X

5. Push the updated code to GitHub.

    git push origin vX.X.X